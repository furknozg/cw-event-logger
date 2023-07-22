const { PubSub } = require("@google-cloud/pubsub");
const dotenv = require("dotenv").config();
const environ = process.env;

exports.publish = async function (event) {
  const projectID = environ.GCLOUD_PROJECT;

  const pubsubClient = new PubSub({
    projectID,
  });

  const dataBuffer = Buffer.from(JSON.stringify(event));
  try {
    const messageId = await pubsubClient
      .topic(environ.PUBSUB_TOPIC)
      .publishMessage({ data: dataBuffer });
    console.log(`[INFO: Message ${messageId} published.]`);
  } catch (error) {
    throw error;
  }
};
