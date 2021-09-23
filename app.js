const express = require("express");
const apiRouter = require("./routers/api.router");
const { send404, handlePSQLError } = require("./controllers/error.controller");
const app = express();

app.use(express.json());
app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  next(res);
});

app.use((err, req, res, next) => {
  if (err.code) {
    handlePSQLError(res, next);
  } else {
    send404(res, next);
  }
});

module.exports = app;
