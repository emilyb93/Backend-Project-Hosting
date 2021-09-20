const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

exports.fetchArticleById = async (article_id) => {
  console.log("in the model", article_id);
  const fetchArticle = () => {
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [
      article_id,
    ]).then((results)=>{
        return results.rows[0]
    })
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
      console.log("in the promise")
      results[0].comment_count = results[1]
      return results[0]
    }
  )
  
};
