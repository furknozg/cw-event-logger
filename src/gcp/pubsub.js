const { PubSub } = require("@google-cloud/pubsub");
const dotenv = require("dotenv").config();
const environ = process.env;

const pubsubClient = new PubSub({
  projectId: environ.GCLOUD_PROJECT,
});

console.log(environ.PUBSUB_TOPIC);
const eventTopic = pubsubClient.topic(environ.PUBSUB_TOPIC);

exports.publish = async function (event) {
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
