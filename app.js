const express = require("express");
const apiRouter = require("./routers/api.router");
const { send404, handlePSQLError} = require("./controllers/error.controller");
const app = express();

app.use("/api", apiRouter);

app.all("*", (req,res,next) =>{
    console.log("in all")
    next(res)
})

app.use((err, req, res, next) => {
  //   console.log("in app");
  console.log(err.code, "in the app")
  if (err.code) {
      console.log("found an error code")
    handlePSQLError(res, next);
  } else {
      console.log("send 404")
    send404(res, next);
  }
});

module.exports = app;
