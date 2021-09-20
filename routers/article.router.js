const express = require("express");
const { sendArticles } = require("../controllers/article.controller.js");


const articleRouter = express.Router();

articleRouter.get("/:article_id", sendArticles);

articleRouter.use((err, req, res, next)=>{
    next(err)
})

module.exports = articleRouter
