const express = require("express");
const {
  sendArticles,
  updateArticleVotes,
  sendAllArticles,
} = require("../controllers/article.controller.js");
const {
  sendAllCommentsByArticleID,
  addCommentToArticle,
} = require("../controllers/comment.controller.js");
const commentRouter = require("./comment.router");

const articleRouter = express.Router();

articleRouter.get("/", sendAllArticles);

articleRouter
    .route("/:article_id") 
    .get(sendArticles)
    .patch(updateArticleVotes);

articleRouter
  .route("/:article_id/comments")
  .get(sendAllCommentsByArticleID)
  .post(addCommentToArticle);

articleRouter.use((err, req, res, next) => {
  next(err);
});

module.exports = articleRouter;
