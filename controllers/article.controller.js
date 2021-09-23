const {
  fetchArticleById,
  patchArticleVotes,
  checkArticleExists,
  fetchAllArticles,
} = require("../models/article.model.js");
const { fetchAllCommentsByArticleID } = require("../models/comment.model.js");

exports.sendArticles = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    if (article_id) {
      const singleArticle = await fetchArticleById(article_id);

      res.status(200).send({ article: singleArticle });
    }
  } catch (err) {
    next(err);
  }
};

exports.updateArticleVotes = async (req, res, next) => {
  const { article_id } = req.params;
  const updateObj = req.body;

  try {
    await checkArticleExists(article_id);

    const results = await patchArticleVotes(article_id, updateObj);

    res.status(202).send({ article: results });
  } catch (err) {
    next(err);
  }
};

exports.sendAllArticles = async (req, res, next) => {
  const query = req.query;

  try {
    const sortedArticles = await fetchAllArticles(query);

    res.status(200).send({ articles: sortedArticles });
  } catch (err) {
    next(err);
  }
};
