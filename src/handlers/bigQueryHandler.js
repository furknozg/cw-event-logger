const bigquery = require("../gcp/bigquery");

const activeDailyUsersQuery = `
SELECT
  CAST(timestamp_seconds(event_time) AS DATE) AS day,
  COUNT(DISTINCT user_id) AS user_count
FROM
  \`cw-event-logger.events.logs\`
GROUP BY
  day
ORDER BY
  day;
`;

const averageSessionDurationQuery = `
WITH sessions AS (
    SELECT
      user_id,
      session_id,
      MIN(event_time) AS session_start,
      MAX(event_time) AS session_end
    FROM
      \`cw-event-logger.events.logs\`
    GROUP BY
      user_id,
      session_id
  ),
  
  session_durations AS (
    SELECT
      user_id,
      TIMESTAMP_DIFF(timestamp_seconds(session_end), timestamp_seconds(session_start), SECOND) AS duration_seconds,
      session_end
    FROM
      sessions
  )
  SELECT
    CAST(timestamp_seconds(session_end) AS DATE) AS day,
    AVG(duration_seconds) AS average_session_duration
  FROM
    session_durations
  GROUP BY
    day
  ORDER BY
    day;
`;

const newDailyUsersQuery = `
WITH user_sessions AS (
    SELECT
      user_id,
      MIN(event_time) AS first_event_time
    FROM
      \`cw-event-logger.events.logs\`
    GROUP BY
      user_id
  )
  SELECT
    CAST(timestamp_seconds(event_time) AS DATE) AS day,
    COUNT(DISTINCT d.user_id) AS new_user_count
  FROM
    \`cw-event-logger.events.logs\` d
  INNER JOIN
    user_sessions
  ON
    d.user_id = user_sessions.user_id
    AND CAST(timestamp_seconds(d.event_time) AS DATE) = CAST(timestamp_seconds(first_event_time) AS DATE)
  GROUP BY
    day
  ORDER BY
    day;


`;

const userCountQuery = `
SELECT COUNT(user_id) as total_users
    FROM 
        (SELECT DISTINCT(user_id) 
            FROM \`cw-event-logger.events.logs\`)
`;

exports.handleGetAnalytics = async function () {
  // TODO: format the analytics to the desired format in here
  activeDailyUsers = await bigquery.executeQuery(activeDailyUsersQuery);
  averageSessionDuration = await bigquery.executeQuery(
    averageSessionDurationQuery
  );
  newDailyUsers = await bigquery.executeQuery(newDailyUsersQuery);
  userCount = await bigquery.executeQuery(userCountQuery);

  daily_stats_array = [];

  // the ugly part of formatting, may put this and the queries into its own util
  // also average session duration might be in seconds, may need to change that in the query
  newDailyUsers.forEach((element) => {
    daily_stats_array.push({
      date: element["day"].value,
      average_session_duration: averageSessionDuration.filter((item) => {
        return item.day.value === element["day"].value;
      })[0]["average_session_duration"],
      active_user_count: activeDailyUsers.filter((item) => {
        return item.day.value === element["day"].value;
      })[0]["user_count"],
      new_user_count: newDailyUsers.filter((item) => {
        return item.day.value === element["day"].value;
      })[0]["new_user_count"],
    });
  });

  const responseFormat = {
    total_users: userCount[0]["total_users"],
    daily_stats: daily_stats_array,
  };

  console.log(responseFormat);
  return responseFormat;
};
