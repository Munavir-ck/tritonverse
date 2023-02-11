const mongoose=require("mongoose")

const coupenSchema=new  mongoose.Schema({
    coupenCode:{
        type: String,
        required:true,
        unique:true
    },
    available:{
        type:Number,

    },
    expireDte:{
        type:Date,
     
    },
    coupenValue:{
        type:Number,
        required:true,

    },
    status:{
        type:String,
        default:"active"
    },
    usageLimit:{
        type:Number
    },
    cartValue:{
        type:Number
    },
    users:[
        {
            type:String,
            ref:"user"
        }
    ]

    
}, { timestamps: true })
module.exports=mongoose.model("coupen",coupenSchema)