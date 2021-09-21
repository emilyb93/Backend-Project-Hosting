const {fetchAllCommentsByArticleID} = require("../models/comment.model.js")

exports.sendAllCommentsByArticleID = async (req, res, next) =>{
    const {article_id} = req.params
    console.log(Object.keys(req))
    console.log(req.originalUrl)

    // const result = await fetchAllCommentsByArticleID()
    // FIGURE HOW TO GET THE PARAM FROM THE URL}