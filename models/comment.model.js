const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

exports.fetchAllCommentsByArticleID = async (req) => {
  const { article_id } = req.params;

  const result = await db.query(
    "SELECT * FROM comments WHERE article_id = $1 ORDER BY comment_id DESC",
    [article_id]
  );
  return result.rows;
};

exports.postNewComment = async (req) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  if (!body) {
    throw { code: 400 };
  }
  const result = await db.query(
    `INSERT INTO comments (
        author, article_id, votes, created_at, body
    )
    VALUES ($1, $2, $3, $4, $5) RETURNING*;`,
    [username, article_id, 0, new Date(Date.now()), body]
  );

  return result.rows[0];
};

exports.deleteCommentByID = async (req) => {
  const { comment_id } = req.params;

  const check = await db.query("SELECT FROM comments WHERE comment_id = $1", [
    comment_id,
  ]);
  if (check.rows.length === 0 || comment_id <= 0) {
    throw { status: 404 };
  }
  await db.query("DELETE FROM comments WHERE comment_id = $1", [comment_id]);
};

exports.patchCommentVotes = async (req) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (!inc_votes || Object.keys(req.body).length !== 1) {
    throw { code: 400 };
  }

  const result = await db.query(
    "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING*;",
    [inc_votes, comment_id]
  );

  return result.rows[0];
};

exports.checkCommmentExists = async (req) => {
  const { comment_id } = req.params;

  const result = await db.query(
    "SELECT * FROM comments WHERE comment_id = $1;",
    [comment_id]
  );
  

  if (result.rows.length === 0) {
    throw { status: 404 };
  }
};
