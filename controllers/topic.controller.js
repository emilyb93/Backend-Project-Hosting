const { fetchAllTopics } = require("../models/topic.model.js");

exports.sendAllTopics = async (req, res, next) => {
  const result = await fetchAllTopics();

  res.status(200).send({ topics: result });
};
