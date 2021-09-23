const express = require("express");
const apiRouter = express.Router();
const { sendGreeting } = require("../controllers/api.controller");
const {userRouter, articleRouter, commentRouter, topicRouter} = require('./index')

apiRouter.get(`/`, sendGreeting);

apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use('/comments', commentRouter)
apiRouter.use('/users', userRouter)


apiRouter.use((err, req, res, next) => {
  next(err);
});

module.exports = apiRouter;
