const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({

    productname:{
       type:String
    },
    cname:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
     stock:{
        type:Number
     },
    price:{
        type:Number
    },
    description:{
        type:String
    },
    imagepath:{
        type:Array
    }

});

const Product=mongoose.model('Product',productSchema);
module.exports=Product;
