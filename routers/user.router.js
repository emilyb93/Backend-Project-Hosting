const db = require("../db/connection");
const express = require("express");
const userRouter = express.Router();

const { sendAllUsers } = require("../controllers/user.controller");

userRouter.get("/", sendAllUsers);

userRouter.use((err, req, res, next) => {
  next(err);
});

module.exports = userRouter;
