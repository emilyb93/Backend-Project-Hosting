const {
  fetchAllCommentsByArticleID,
  postNewComment,
  deleteCommentByID,
  patchCommentVotes,
  checkCommmentExists,
} = require("../models/comment.model.js");
const { checkArticleExists } = require("../models/article.model");
const { checkUserExists } = require("../models/user.model.js");
exports.sendAllCommentsByArticleID = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    await checkArticleExists(article_id);
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
    await checkUserExists(username)
    const result = await postNewComment(username, body, article_id);

    res.status(201).send({ msg: "Created", comment: result });
  } catch (err) {
    next(err);
  }
};

exports.removeCommentByID = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    await deleteCommentByID(comment_id);

    res.status(202).send({ msg: "Accepted" });
  } catch (err) {
    next(err);
  }
};

exports.updateCommentVotes = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    const check = await checkCommmentExists(comment_id);

    const result = await patchCommentVotes(comment_id, inc_votes);

    res.status(202).send({ comment: result });
  } catch (err) {
    next(err);
  }
};
