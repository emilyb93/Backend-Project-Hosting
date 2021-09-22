const endpoints = require("../endpoints.json");
const { sendAllCommentsByArticleID } = require("./comment.controller");

exports.sendGreeting = async (req, res, next) => {
  const apiObject = {
    msg: "Hello Welcome to the NC News API",
    endpoints: endpoints,
  };

  // console.log(endpoints.json())
  try {
    return res.status(200).send(apiObject);
  } catch (err) {
    next(err);
  }
};
