const mongoose = require('mongoose')
require("dotenv").config()
mongoose.set("strictQuery", false);
const mon=process.env.mongo
module.exports.dbConnection=function (cb){
    mongoose.connect(mon, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{
        cb(true)
    }).catch((err)=>{
        console.log(err);
        cb(false)
    })
    
}
 


   

