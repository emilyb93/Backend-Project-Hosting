const { fetchAllCommentsByArticleID } = require("../models/comment.model.js");

exports.sendAllCommentsByArticleID = async (req, res, next) => {
  const { article_id } = req.params;
  // console.log(article_id)

  try {
    const result = await fetchAllCommentsByArticleID(article_id);

    res.status(200).send({ comments: result });
  } catch (err) {
    next(err);
  }
};
