const {
  fetchArticleById,
  patchArticleVotes,
  checkArticleExists,
  fetchAllArticles,
} = require("../models/article.model.js");

exports.sendArticles = async (req, res, next) => {
  try {
    const singleArticle = await fetchArticleById(req);

    res.status(200).send({ article: singleArticle });
  } catch (err) {
    next(err);
  }
};

exports.updateArticleVotes = async (req, res, next) => {
  try {
    await checkArticleExists(req);

    const results = await patchArticleVotes(req);

    res.status(202).send({ article: results });
  } catch (err) {
    next(err);
  }
};

exports.sendAllArticles = async (req, res, next) => {
  try {
    const sortedArticles = await fetchAllArticles(req);

    res.status(200).send({ articles: sortedArticles });
  } catch (err) {
    next(err);
  }
};
