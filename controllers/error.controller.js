exports.send404 = (res) => {
  res.status(404).send({ msg: "Not Found" });
};

exports.handlePSQLError = (res) => {
  res.status(400).send({ msg: "Bad Request" });
};
