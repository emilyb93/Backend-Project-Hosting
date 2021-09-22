const db = require("../db/connection");

exports.fetchAllCommentsByArticleID = async (article_id) => {
  const result = await db.query(
    "SELECT * FROM comments WHERE article_id = $1",
    [article_id]
  );
  return result.rows;
};

exports.postNewComment = async (username, body, article_id) => {
    try {
    //   console.log("in the model");
    //   console.log(username, body, article_id)
    const result = await db.query(
      `INSERT INTO comments (
        author, article_id, votes, created_at, body
    )
    VALUES ($1, $2, $3, $4, $5) RETURNING*;`,
      [username, article_id, 0, new Date(Date.now()) , body]
    );
        // console.log("query made sucessfully")
    return result.rows[0];
    // console.log(result.rows)
  } catch (err) {
    //   console.log(err)
    next(err);
  }
};
