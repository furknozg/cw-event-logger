const { BigQuery } = require("@google-cloud/bigquery");

exports.executeQuery = async function (query) {
  const bigquery = new BigQuery();

  const options = {
    query: query,
    location: "US",
  };

  const [job] = await bigquery.createQueryJob(options);
  console.log(`Job ${job.id} started.`);

  const [rows] = await job.getQueryResults();

  return rows;
};
