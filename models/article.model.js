const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");
const articleRouter = require("../routers/article.router");

exports.fetchArticleById = async (article_id) => {
  //   console.log("in the model", article_id);
  const fetchArticle = () => {
    return db
      .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
      .then((results) => {
        return results.rows[0];
      });
  };
  const fetchSumOfComments = () => {
    return db
      .query("SELECT * FROM comments WHERE article_id = $1;", [article_id])
      .then((results) => {
        return results.rows.length;
      });
  };

  return await Promise.all([fetchArticle(), fetchSumOfComments()]).then(
    (results) => {
      // console.log("in the promise", results)
      if (!results[0]) {
        //   console.log("reject it")
        return Promise.reject({ code: "Article Not Found" });
      } else {
        results[0].comment_count = results[1];
        return results[0];
      }
    }
  );
};

exports.patchArticleVotes = async (article_id, updateObj) => {
  if (updateObj.inc_votes === 0 || Object.keys(updateObj).length !== 1) {
    return Promise.reject({ code: 400, msg: "Bad Request" });
  }
  //   console.log(updateObj, "in the model")

  const { inc_votes } = updateObj;
  // console.log(inc_votes)
  const result = await db.query(
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*;",
    [inc_votes, article_id]
  );

  return result.rows[0];
};

exports.checkArticleExists = async (article_id) => {
  // console.log("in the model")

  const result = await db.query(
    "SELECT * FROM articles WHERE article_id = $1;",
    [article_id]
  );
  // console.log(article_id, result.rows, "in model");
  if (result.rows.length === 0) {
    // console.log(result.rows, "zero length")
    return Promise.reject({status : 404, msg : 'Not Found'})
  }
};
