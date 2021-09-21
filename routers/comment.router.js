const express = require("express")

const commentRouter = express.Router()
const { sendAllCommentsByArticleID } = require("../controllers/comment.controller.js")

commentRouter.get('/', sendAllCommentsByArticleID)
module.exports = commentRouter