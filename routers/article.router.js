const express = require("express");
const { sendArticles, updateArticleVotes } = require("../controllers/article.controller.js");
const commentRouter = require('./comment.router')


const articleRouter = express.Router();


articleRouter.get("/:article_id", sendArticles);
articleRouter.patch('/:article_id', updateArticleVotes)
articleRouter.use('/:article_id/comments', commentRouter)


articleRouter.use((err, req, res, next)=>{
    next(err)
})

module.exports = articleRouter
