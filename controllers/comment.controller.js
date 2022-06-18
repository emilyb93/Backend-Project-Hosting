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
  try {
    await checkArticleExists(req);
    const result = await fetchAllCommentsByArticleID(req);

    res.status(200).send({ comments: result });
  } catch (err) {
    next(err);
  }
};

exports.addCommentToArticle = async (req, res, next) => {
  try {
    await checkUserExists(req);
    const result = await postNewComment(req);

    res.status(201).send({ msg: "Created", comment: result });
  } catch (err) {
    next(err);
  }
};

exports.removeCommentByID = async (req, res, next) => {
  try {
    await deleteCommentByID(req);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.updateCommentVotes = async (req, res, next) => {
  try {
    await checkCommmentExists(req);

    const result = await patchCommentVotes(req);

    res.status(202).send({ comment: result });
  } catch (err) {
    next(err);
  }
};
