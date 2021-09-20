const {fetchArticleById} = require("../models/article.model.js")

exports.sendArticles = (req, res, next) => {
    console.log("in art controller")



    if (req.params){
        console.log("found param of", req.params.article_id)
        const {article_id} = req.params
        fetchArticleById(article_id).then((results)=>{
            res.status(200).send({article : results})
        }).catch(err=>{
            // console.log(err)
            next(err)
        })
    }
  
};
