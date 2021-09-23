const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

exports.fetchAllCommentsByArticleID = async (article_id) => {
  // try {
    const result = await db.query(
      "SELECT * FROM comments WHERE article_id = $1",
      [article_id]
    );
    return result.rows;
  // } catch (err) {
  //   throw err;
  // }
};

exports.postNewComment = async (username, body, article_id) => {
  // try {
    const result = await db.query(
      `INSERT INTO comments (
        author, article_id, votes, created_at, body
    )
    VALUES ($1, $2, $3, $4, $5) RETURNING*;`,
      [username, article_id, 0, new Date(Date.now()), body]
    );

    return result.rows[0];
  // } catch (err) {
  //   throw err;
  // }
};

exports.deleteCommentByID = async (comment_id) => {
  // try {
    
    const check = await db.query("SELECT FROM comments WHERE comment_id = $1", [comment_id])
    if (check.rows.length === 0 || comment_id <= 0){
      throw ({status : 404})
    }
    await db.query("DELETE FROM comments WHERE comment_id = $1", [comment_id]);
  // } catch (err) {
  //   // console.log(err, "err found");
  //   throw (err);
  // }
};
