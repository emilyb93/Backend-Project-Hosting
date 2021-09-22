const { fetchAllCommentsByArticleID, postNewComment } = require("../models/comment.model.js");

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

exports.addCommentToArticle = async (req, res, next) => {
const {username, body} = req.body
const {article_id} = req.params

try {
    //   console.log("into the controller")

    //  await checkUserExists(username) 

    //  console.log("username exists")
    const result = await postNewComment(username, body, article_id);
    // console.log("comment posted")
    // console.log(result)
    res.status(202).send({msg : "Accepted",
                        comment : result})

} catch (err) {
    next(err);
  }
};
