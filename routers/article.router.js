const express = require("express");
const { sendArticles, updateArticleVotes } = require("../controllers/article.controller.js");


const articleRouter = express.Router();

articleRouter.get("/:article_id", sendArticles);
articleRouter.patch('/:article_id', updateArticleVotes)

articleRouter.use((err, req, res, next)=>{
    next(err)
})

module.exports = articleRouter
