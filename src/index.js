const express = require("express");

const logging = require("./controllers/infrastructure");
const postHandler = require("./handlers/postPubSubHandler");

const logger = logging.getLogger();

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  logging.encapsulateRequest(req, (req) => {
    response = postHandler.handlePubSubPublish(req.body);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});