const { type } = require("jquery")
const moongoose = require("mongoose")

const address=new moongoose.Schema({
    address:[{
     fullName:{
        type:String,
        required:true
        
     },
     phone:{
        type:String,
        required:true
     },
     state:{
        type:String,
        required:true
     },
     pinCode:{
        type:Number,
        required:true
     },
     area:{
        type:String,
        required:true
     },
     buildingName:{
        type:String,
    
     }
   }],
   user:{
      type:String,
       ref:"user"
   }

})
module.exports=moongoose.model("address",address)
   