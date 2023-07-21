const { response } = require("express");
const pubsub = require("../gcp/pubsub");

exports.handlePubSubPublish = async function (req) {
  try {
    let response = null;
    if (validateRequest(req)) {
      console.log(typeof JSON.stringify(req), JSON.stringify(req));
      response = pubsub.publish(JSON.stringify(req));
    } else throw "Bad Request, JSON expected";

    await response;
    return response;
  } catch (err) {
    throw err;
  }
};

function validateRequest(req) {
  return true;
}
