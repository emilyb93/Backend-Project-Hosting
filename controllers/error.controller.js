exports.send404 = (res) =>{
    // console.log("404"s)
    res.status(404).send({msg : "Not Found"})
}

exports.handlePSQLError = (res)=>{
    // console.log("psql error")
    
    res.status(400).send({msg : "Bad Request"})
}