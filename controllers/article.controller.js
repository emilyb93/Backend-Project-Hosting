const {
  fetchArticleById,
  patchArticleVotes,
  checkArticleExists,
} = require("../models/article.model.js");

exports.sendArticles = (req, res, next) => {
  //   console.log("in art controller");

  //   console.log("found param of", req.params.article_id);
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((results) => {
      res.status(200).send({ article: results });
    })
    .catch((err) => {
      // console.log(err)
      next(err);
    });
};

exports.updateArticleVotes = async (req, res, next) => {
  const { article_id } = req.params;
  const updateObj = req.body;

  //   console.log(article_id, "and", inc_votes)

  try {
    // console.log("inside try block")
    await checkArticleExists(article_id);
    // console.log(articleInfo);

    // console.log("article exists")
    const results = await patchArticleVotes(article_id, updateObj);
    // console.log(results.rows)

    res.status(202).send({ article: results });
  } catch (err) {
    next(err);
  }
};
