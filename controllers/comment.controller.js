const {
  fetchAllCommentsByArticleID,
  postNewComment, deleteCommentByID
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


exports.removeCommentByID = async (req ,res ,next)=>{
try{
  const {comment_id} = req.params
  await deleteCommentByID(comment_id)

  res.status(204).send({msg : "Accepted"})
  } catch (err) {
  next(err)
}
}
