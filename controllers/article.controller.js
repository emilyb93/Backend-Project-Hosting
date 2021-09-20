const { fetchArticleById, patchArticleVotes} = require("../models/article.model.js");

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

exports.updateArticleVotes = (req, res, next) => {


  const { article_id } = req.params;
  const updateObj  = req.body

//   console.log(article_id, "and", inc_votes)


  patchArticleVotes(article_id, updateObj)
  .then((results)=>{
    //   console.log(results)
      res.status(202).send({ 'article' : results })
  }).catch((err)=>{
    //   console.log("error", err)
      next(err)
  })
};
