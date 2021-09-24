const express = require("express");

const commentRouter = express.Router();
const {
  updateCommentVotes, removeCommentByID
} = require("../controllers/comment.controller.js");

// commentRouter.get("/:article_id", sendAllCommentsByArticleID);

commentRouter.delete('/:comment_id', removeCommentByID)

commentRouter.patch('/:comment_id', updateCommentVotes)

module.exports = commentRouter;
