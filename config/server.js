const mongoose = require('mongoose')

module.exports.dbConnection=function (cb){
    mongoose.connect('mongodb://0.0.0.0:27017/shopping', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(()=>{
        cb(true)
    }).catch((err)=>{
        console.log(err);
        cb(false)
    })
    
}
 


   

