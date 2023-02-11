const moongoose = require("mongoose")

const UserCart=new moongoose.Schema({
    owner:{
        type:String,
        ref:"user"
    },
    items:[{
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
    cartTotal:{
        type :Number,
        default:0
    }
})

const cart=moongoose.model("Cart",UserCart)
module.exports=cart;