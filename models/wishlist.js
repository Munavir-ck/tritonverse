const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: "user",
  },
  items:[{
  type:String,
  ref:"product"

 } ]
    
  

});
module.exports=mongoose.model("wishList",wishListSchema)