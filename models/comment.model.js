const db = require("../db/connection");

exports.fetchAllCommentsByArticleID = async (article_id) => {
  try {
    const result = await db.query(
      "SELECT * FROM comments WHERE article_id = $1",
      [article_id]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

exports.postNewComment = async (username, body, article_id) => {
  try {
    const result = await db.query(
      `INSERT INTO comments (
        author, article_id, votes, created_at, body
    )
    VALUES ($1, $2, $3, $4, $5) RETURNING*;`,
      [username, article_id, 0, new Date(Date.now()), body]
    );

    return result.rows[0];
  } catch (err) {
    throw(err);
  }
};
