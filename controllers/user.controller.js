const { fetchAllUsers } = require("../models/user.model");

exports.sendAllUsers = async (req, res, next) =>{
    try {

        const results = await fetchAllUsers()

        res.status(200).send({users : results})


    }catch(err){
        next(err)
    }
}