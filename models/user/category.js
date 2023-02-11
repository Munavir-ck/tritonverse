const mongoose=require("mongoose")

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
       


    },
    description:{
        type:String
    }
})
module.exports=mongoose.model("category",categorySchema)