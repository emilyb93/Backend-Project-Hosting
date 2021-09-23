const db = require("../db/connection");
const userRouter = require("../routers/user.router");

exports.checkUserExists = async (username) => {
  // try {
  const result = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (!result.rows[0]) {
    const err = { status: 404, msg: "Not Found" };
    throw err;
  }
  // } catch (err) {
  //   throw(err);
  // }
};

exports.fetchAllUsers = async () => {
  const results = await db.query("SELECT username FROM users;");
  return results.rows;
};

exports.fetchUserInfo = async (username) => {
  const result = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (result.rows.length === 0) {
    throw { status: 404 };
  }

  return result.rows[0];
};
