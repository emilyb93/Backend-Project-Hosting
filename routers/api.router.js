const express = require("express")
const  apiRouter = express.Router()
const {sendGreeting} = require("../controllers/api.controller")

apiRouter.get(`/`, sendGreeting)

module.exports = apiRouter