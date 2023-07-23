const express = require("express");

const logging = require("./controllers/infrastructure");
const postHandler = require("./handlers/postPubSubHandler");
const getHandler = require("./handlers/bigQueryHandler");

const logger = logging.getLogger();

const app = express();
const port = 8080;

app.use(express.json());

app.get("/", (req, res) => {
  let response = null;
  try {
    logging.encapsulateRequest(req, async (req) => {
      response = await getHandler.handleGetAnalytics();
      res.send(response);
    });
  } catch (err) {
    res.send(err);
  }
});

app.post("/", (req, res) => {
  try {
    logging.encapsulateRequest(req, async (req) => {
      response = await postHandler.handlePubSubPublish(req.body);
      res.sendStatus(200);
    });
  } catch (err) {
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
