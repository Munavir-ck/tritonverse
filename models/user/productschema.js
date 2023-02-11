const moongoose =require("mongoose")
 
const product=new moongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:Array,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discription:{
        type:String
    },
    category:{
        type:String,
        ref:"category",
        required:true
    },
    brand:{
        type:String,
 
    },
    discount:{
        type:Number
    },
    quantity:{
        type:Number,
      
    }
   
})

module.exports=moongoose.model("product",product)
