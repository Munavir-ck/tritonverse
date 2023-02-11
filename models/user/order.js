const mongoose=require("mongoose")

const orderSchema=new mongoose.Schema({
    date:{
        type:Date
    },
    buyer:{
        type:String,
        ref:"user"
    },
    products:[{
        Product:{
            type:String,
            ref:"product"
        } ,   
        Price:{
            type:Number,
            default:0
        },
        quantity:{
            type:Number,
            default:1
        }
    }],
   
    totalPrice:{
        type:Number
    },
    address:{
        type:String,
        ref:"address"
       
    },
    orderstatus:{
        type:String
    },
    paymentMethod:{
        type:String
    },
    paymentStatus:{
        type:String
    },
    discount:{
        type:Number
    }
},
  {timestamps:true}  )

module.exports=mongoose.model("Order", orderSchema)
