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
    if (!body){
      throw({code : 400})
    }
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

  const check = await db.query("SELECT FROM comments WHERE comment_id = $1", [
    comment_id,
  ]);
  if (check.rows.length === 0 || comment_id <= 0) {
    throw { status: 404 };
  }
  await db.query("DELETE FROM comments WHERE comment_id = $1", [comment_id]);
  // } catch (err) {
  //   // console.log(err, "err found");
  //   throw (err);
  // }
};

exports.patchCommentVotes = async (comment_id, inc_votes) => {
  if (!inc_votes){
    throw({code : 400})
  }
  
  const result = await db.query(
    "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING*;",
    [inc_votes, comment_id]
  );

  return result.rows[0];
};

exports.checkCommmentExists = async (comment_id) => {

  
  const result = await db.query(
    "SELECT * FROM comments WHERE comment_id = $1;",
    [comment_id]
  );

  if (result.rows.length === 0) {
    throw { status: 404 };
  }
};
