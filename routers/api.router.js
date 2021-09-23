const express = require("express");
const apiRouter = express.Router();
const { sendGreeting } = require("../controllers/api.controller");
const topicRouter = require("../routers/topic.router.js");
const articleRouter = require("../routers/article.router.js");

apiRouter.get(`/`, sendGreeting);

apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouter);

apiRouter.use((err, req, res, next) => {
  next(err);
});

module.exports = apiRouter;
