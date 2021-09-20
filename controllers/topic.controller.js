const { fetchAllTopics } = require("../models/topic.model.js")

exports.sendAllTopics = (req, res, next)=>{
    fetchAllTopics().then((topics)=>{
        res.status(200).send({topics : topics})
    })
}