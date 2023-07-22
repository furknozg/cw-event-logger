const { PubSub } = require("@google-cloud/pubsub");
const dotenv = require("dotenv").config();
const environ = process.env;

exports.publish = async function (event) {
  const projectID = environ.GCLOUD_PROJECT;

  const pubsubClient = new PubSub({
    projectID,
  });

  console.log(environ.PUBSUB_TOPIC);
  const eventTopic = pubsubClient.topic(environ.PUBSUB_TOPIC);

  console.log(typeof environ.PUBSUB_TOPIC, environ.PUBSUB_TOPIC);
  console.log(typeof eventTopic, eventTopic);

  const dataBuffer = Buffer.from(JSON.stringify(event));
  try {
    const messageId = await pubsubClient
      .topic(eventTopic)
      .publishMessage({ data: dataBuffer });
    console.log(`[INFO: Message ${messageId} published.]`);
  } catch (error) {
    throw error;
  }
};
