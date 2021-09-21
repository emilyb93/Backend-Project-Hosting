const express = require("express")

const commentRouter = express.Router()
const { sendAllCommentsByArticleID } = require("../controllers/comment.controller.js")

commentRouter.get('/:article_id', sendAllCommentsByArticleID)
module.exports = commentRouter