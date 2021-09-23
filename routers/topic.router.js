const express = require("express");
const { sendAllTopics } = require("../controllers/topic.controller.js");

const topicRouter = express.Router();

topicRouter.get("/", sendAllTopics);

module.exports = topicRouter;
