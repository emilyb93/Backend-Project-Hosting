const db = require("../db/connection")
const pg = require("pg")

exports.fetchAllTopics = async () => {
return await db.query("SELECT * FROM topics")
.then((result)=>{
    return result.rows
})
}