const mongoose = require('mongoose')
require("dotenv").config()
mongoose.set("strictQuery", false);
const mon=process.env.mongo

console.log(mon,22)


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
 


   

