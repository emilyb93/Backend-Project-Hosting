const { parse } = require("dotenv");
const db = require("../db/connection");

exports.fetchArticleById = async (req) => {
  const { article_id } = req.params;

  let fetchedArticle = await db.query(
    "SELECT articles.*, COUNT (comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
    [article_id]
  );

  fetchedArticle = fetchedArticle.rows[0];

  if (!fetchedArticle) {
    throw { status: 404 };
  } else {
    fetchedArticle["comment_count"] = parseInt(fetchedArticle["comment_count"]);
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
  let queryStr =
    "SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, COUNT(c.article_id)::int as comment_count FROM articles AS a LEFT JOIN comments AS c ON a.article_id = c.article_id";
  let queryValues = [];
  let currentQueryCount = 1;

  const validQueries = {
    date: "created_at",
    author: "author",
    votes: "votes",
    title: "title",
    article_id: "article_id",
    topic: "topic",
    comment_count: "comment_count",
  };

  const validQueryKeys = ["order", "sort_by", "topic", "author"];

  Object.keys(query).forEach((queryKey) => {
    if (validQueryKeys.indexOf(queryKey) === -1) {
      throw { code: 400 };
    }
  });

  if (query.topic) {
    queryStr += ` WHERE a.topic = $${currentQueryCount}`;
    queryValues.push(query.topic);
    currentQueryCount++;
  }

  if (query.author) {
    if (currentQueryCount > 1) {
      queryStr += " AND";
    } else {
      queryStr += " WHERE";
    }
    queryStr += ` a.author = $${currentQueryCount}`;
    queryValues.push(query.author);
  }

  queryStr += " GROUP BY a.article_id";
  // adds order by
  if (query.sort_by) {
    if (validQueries[query.sort_by]) {
      queryStr += ` ORDER BY ${validQueries[query.sort_by]}`;
    }
  } else {
    queryStr += ` ORDER BY a.created_at`;
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
    return rows;
  }
};
