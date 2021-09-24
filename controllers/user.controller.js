const { fetchAllUsers, fetchUserInfo } = require("../models/user.model");

exports.sendAllUsers = async (req, res, next) => {
  try {
    const results = await fetchAllUsers();

    res.status(200).send({ users: results });
  } catch (err) {
    next(err);
  }
};

exports.sendUserInfo = async (req, res, next) => {
  try {
    const result = await fetchUserInfo(req);

    res.status(200).send({ user: result });
  } catch (err) {
    next(err);
  }
};
