const express = require("express");

const commentRouter = express.Router();
const {
  sendAllCommentsByArticleID, removeCommentByID
} = require("../controllers/comment.controller.js");

commentRouter.get("/:article_id", sendAllCommentsByArticleID);

commentRouter.delete('/:comment_id', removeCommentByID)

module.exports = commentRouter;
