const db = require("../db/connection");
const express = require("express");
const userRouter = express.Router();

const { sendAllUsers, sendUserInfo } = require("../controllers/user.controller");

userRouter.get("/", sendAllUsers);

userRouter.get('/:username', sendUserInfo)

userRouter.use((err, req, res, next) => {
  next(err);
});

module.exports = userRouter;
