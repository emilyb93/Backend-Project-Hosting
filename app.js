const express = require("express");
const apiRouter = require("./routers/api.router");
const { send404, handlePSQLError } = require("./controllers/error.controller");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  send404(res, next);
});

app.use((err, req, res, next) => {
  if (err.code) {
    handlePSQLError(res, next);
  } else if (err.status === 404) {
    send404(res, next);
  } else {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
