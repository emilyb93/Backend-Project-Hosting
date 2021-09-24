const db = require("../db/connection");

exports.fetchArticleById = async (req) => {
  const { article_id } = req.params;

  let fetchedArticle = await db.query(
    "SELECT * FROM articles WHERE article_id = $1;",
    [article_id]
  );

  fetchedArticle = fetchedArticle.rows[0];
  let sumOfComments = await db.query(
    "SELECT * FROM comments WHERE article_id = $1;",
    [article_id]
  );

  sumOfComments = await sumOfComments.rows.length;

  if (!fetchedArticle) {
    throw { status: 404 };
  } else {
    fetchedArticle["comment_count"] = sumOfComments;
    return fetchedArticle;
  }
};

exports.patchArticleVotes = async (req) => {
  const { article_id } = req.params;
  const updateObj = req.body;

  if (!updateObj.inc_votes || Object.keys(updateObj).length !== 1) {
    throw { code: 400 };
  }

  const { inc_votes } = updateObj;
  const result = await db.query(
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*;",
    [inc_votes, article_id]
  );

  return result.rows[0];
};

exports.checkArticleExists = async (req) => {
  const { article_id } = req.params;
  const result = await db.query(
    "SELECT * FROM articles WHERE article_id = $1;",
    [article_id]
  );

  if (result.rows.length === 0) {
    throw { status: 404, msg: "Not Found" };
  }
};

exports.fetchAllArticles = async (req) => {
  const query = req.query;
  let queryStr = "SELECT * FROM articles";
  let queryValues = [];

  const validQueries = {
    date: "created_at",
    author: "author",
    votes: "votes",
    title: "title",
    article_id: "article_id",
    topic: "topic",
  };

  const validQueryKeys = ["order", "sort_by", "topic"];

  Object.keys(query).forEach((queryKey) => {
    if (validQueryKeys.indexOf(queryKey) === -1) {
      throw { code: 400 };
    }
  });

  if (query.topic) {
    queryStr += " WHERE topic = $1";
    queryValues.push(query.topic);
  }

  // adds order by
  if (query.sort_by) {
    if (validQueries[query.sort_by]) {
      queryStr += ` ORDER BY ${validQueries[query.sort_by]}`;
    }
    // console.log(queryStr, queryValues);
  } else {
    queryStr += ` ORDER BY created_at`;
  }

  // add asc/desc
  if (query.order == "asc") {
    queryStr += ` ASC`;
  } else if (query.order == "desc" || !query.order) {
    queryStr += ` DESC`;
  } else {
    throw { code: 400 };
  }

  
  const { rows } = await db.query(queryStr, queryValues);
  if (rows.length === 0) {
    throw { status: 404, msg: "Not Found" };
  } else {
    const formattedRows = rows.map(async (article) => {
      const sumOfComments = await db.query(
        "SELECT * FROM comments WHERE article_id = $1;",
        [article.article_id]
      );
      article.comment_count = sumOfComments.rows.length;
      delete article.body;
      return article;
    });

    return Promise.all(formattedRows);
  }
};
