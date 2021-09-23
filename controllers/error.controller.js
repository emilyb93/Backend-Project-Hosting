exports.send404 = (res) =>{
    // console.log("in 404")
    res.status(404).send({msg : "Not Found"})
}

exports.handlePSQLError = (res)=>{
    // console.log("in the error controller")
    
    res.status(400).send({msg : "Bad Request"})
}