const mongoose=require("mongoose")

const banner=new mongoose.Schema({

  image:{
    type:String
  }   ,
  title:{
    type:String
  } ,
  url:{
    type:String
  },
  description:{
    type:String
  },
  subImage:{
    type:String
  }
})
module.exports=mongoose.model("banner",banner)