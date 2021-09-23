const db = require("../db/connection");

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
