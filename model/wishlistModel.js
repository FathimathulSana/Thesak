const mongoose = require("mongoose");


const wishlistSchema =new mongoose.Schema({
      
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    products:[
        {
        productId: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        },
        price:{
            type:Number,
            default:0
        }
        }
    ]


});

const wishList=mongoose.model('wishList',wishlistSchema);
module.exports = wishList;