const express = require("express");
const { sendArticles, updateArticleVotes, sendAllArticles } = require("../controllers/article.controller.js");
const { sendAllCommentsByArticleID } = require("../controllers/comment.controller.js");
const commentRouter = require('./comment.router')


const articleRouter = express.Router();


articleRouter.get('/', sendAllArticles)


articleRouter.get("/:article_id", sendArticles);
articleRouter.patch('/:article_id', updateArticleVotes)

articleRouter.get('/:article_id/comments', sendAllCommentsByArticleID)



articleRouter.use((err, req, res, next)=>{
    next(err)
})

module.exports = articleRouter
