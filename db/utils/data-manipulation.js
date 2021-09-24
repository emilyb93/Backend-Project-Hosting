// extract any functions you are using to manipulate your data, into this file

const db = require("../connection")
const format = require("pg-format")
const {query} = require("../connection")

const createTables = async () => {
  await db.query(`CREATE TABLE topics(
        slug VARCHAR UNIQUE PRIMARY KEY,
        description VARCHAR(100) DEFAULT NULL
        );`);
  await db.query(`CREATE TABLE users(
          username VARCHAR(30) UNIQUE PRIMARY KEY,
          avatar_url VARCHAR(300) DEFAULT NULL,
          name VARCHAR(50) NOT NULL
      );`);
  await db.query(`CREATE TABLE articles(
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(300) NOT NULL,
        body VARCHAR NOT NULL,
        votes INT DEFAULT 0,
        topic VARCHAR REFERENCES topics(slug),
        author VARCHAR REFERENCES users(username),
        created_at DATE DEFAULT CURRENT_TIMESTAMP
      );`);
  await db.query(`CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR REFERENCES users(username),
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
        votes INT DEFAULT 0,
        created_at DATE DEFAULT CURRENT_TIMESTAMP,
        body VARCHAR(1000) NOT NULL
      );`);
};

const dropTables = async () => {
  await db.query("DROP TABLE IF EXISTS comments");
  await db.query("DROP TABLE IF EXISTS articles");
  await db.query("DROP TABLE IF EXISTS users");
  await db.query("DROP TABLE IF EXISTS topics");
};


const formatData = (dataObj) => {
    const { articleData, commentData, topicData, userData } = dataObj
    
    const topicValues = topicData.map((topicObj) => {
      return [topicObj.slug, topicObj.description];
    });
    const userValues = userData.map((userObj) => {
      return [userObj.username, userObj.avatar_url, userObj.name];
    });
    const articleValues = articleData.map((artObj) => {
      return [
        artObj.title,
        artObj.body,
        artObj.votes,
        artObj.topic,
        artObj.author,
        artObj.created_at,
      ];
    });
    const commentValues = commentData.map((comObj) => {
      return [
        comObj.author,
        comObj.article_id,
        comObj.votes,
        comObj.created_at,
        comObj.body,
      ];
    });

    return { topicValues, userValues, articleValues, commentValues };
  };

const insertData = async (inputDataObject) => {
    // TOPICS, USERS, ARTICLES, COMMENTS
    const { topicValues, userValues, articleValues, commentValues } = inputDataObject

    const queryStrTopics = format(
      `INSERT INTO topics (slug, description) VALUES %L;`,
      topicValues
    );
    const queryStrUsers = format(
      `INSERT INTO users (username, avatar_url, name) VALUES %L;`,
      userValues
    );
    const queryStrArts = format(
      `INSERT INTO articles (title, body, votes, topic, author, created_at) VALUES %L;`,
      articleValues
    );
    const queryStrComm = format(
      `INSERT INTO comments (author, article_id, votes, created_at, body) VALUES %L;`,
      commentValues
    );

    await db.query(queryStrTopics);
    await db.query(queryStrUsers);
    await db.query(queryStrArts);
    await db.query(queryStrComm);
  };

  module.exports = {dropTables, createTables, formatData, insertData}