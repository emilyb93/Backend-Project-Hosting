const db = require("../connection");
// const format = require("pg-format");
// const articles = require("../data/development-data/articles");
// const { query } = require("../connection");
// const { query } = require("../connection");
const {
  dropTables,
  createTables,
  formatData,
  insertData,
} = require("../utils/data-manipulation");

const seed = async (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables

  const dropAndCreate = async () => {
    await dropTables();
    await createTables();
    // return await showTables().then((results)=>{
    //   console.log(results, "in the seed")

    // })
  };
  await dropAndCreate();

  // 2. insert data

  const inputData = formatData(topicData, userData, articleData, commentData);

  await insertData(inputData);

  // return await db.query(`SELECT * FROM comments;`).then((results) => {
  //   console.log(results.rows);
  // });
};

module.exports = seed;
