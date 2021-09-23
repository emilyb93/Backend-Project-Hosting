const db = require("../db/connection");
const pg = require("pg");

exports.fetchAllTopics = async () => {
  try {
    const allTopics = await db.query("SELECT * FROM topics");

    return allTopics.rows;
  } catch (err) {
    throw err;
  }
};
