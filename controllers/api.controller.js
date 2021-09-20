exports.sendGreeting = (req, res, next) => {
  res
    .status(200)
    .send({ msg: "Hello Welcome to the NC News API" })
    .catch((err) => {
      next(err);
    });
};
