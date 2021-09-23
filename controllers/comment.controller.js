const {
  fetchAllCommentsByArticleID,
  postNewComment,
} = require("../models/comment.model.js");

exports.sendAllCommentsByArticleID = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const result = await fetchAllCommentsByArticleID(article_id);

    res.status(200).send({ comments: result });
  } catch (err) {
    next(err);
  }
};

exports.addCommentToArticle = async (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;

  try {
    const result = await postNewComment(username, body, article_id);

    res.status(202).send({ msg: "Accepted", comment: result });
  } catch (err) {
    next(err);
  }
};
