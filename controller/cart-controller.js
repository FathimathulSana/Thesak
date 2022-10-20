const User = require("../model/userModel");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const session =require("express-session")
const Category = require("../model/categoryModel");
const Cart = require("../model/cartModel");
const cartFunction = require('../controller/cart-function');

const admin=('../model/userModel');


//-----------------add-to-cart---------------------//

module.exports={
    addToCart: async function(req,res,next){
       
        const productId=req.body.productId;
         console.log(productId,"prouctideeeeeeeeeeeeee");
        let userId=req.session.userId;
        // console.log("userIdee getted",userId);
     
       const cart = await Cart.findOne({userId : userId}).lean();
        if(cart){
            productExist = await Cart.findOne({userId : userId,"products.productId" : productId})
         
            if(productExist){
                await Cart.updateOne({userId : userId, "products.productId" : productId},{$inc : {"products.$.quantity" : 1}});
                res.json({message:"success",});
            }
            else
            {
                await Cart.findOneAndUpdate({ userId : userId }, {$push:{products : {productId : productId , quantity : 1}}});
                res.json({message:"success"});
            }
        }
        else
         {
            await Cart.create({ userId : userId, products : {productId : productId, quantity:1} });
            res.json({message:"success"});
         }
    },

    // --------------------view cart-----------------------//

    getViewCart:async function(req,res){
        let userLoggedIn=req.session.userLoggedIn;
        let userId=req.session.userId;
        let categoryDetails = await Category.find().lean();
        cartDetails= await Cart.findOne({userId : userId}).populate("products.productId").lean();
        let totalAmount;
        if(cartDetails){
            totalAmount= await cartFunction.totalAmount(cartDetails);
        }
     

        res.render('user/view-cart',{categoryDetails,cartDetails,totalAmount,layout:'user-layout',userLoggedIn})

    },


    //---------------------------increment-amount---------------------------------//
     

   incrementValue:async function(req,res){
   
    const quantities=parseInt(req.body.quantity);
  //  console.log(quantities,"55555555555555");
    const userId=req.body.userId;
    await Cart.updateOne({ userId : userId , "products.productId" : req.body.product}, {"products.$.quantity" : quantities});

    const cartDetails=await Cart.findOne({ userId : userId , "products.productId" : req.body.product }).populate("products.productId").lean();
   // console.log(cartDetails,'999999999999999');
    const price= (cartDetails.products[req.body.index].productId.price - cartDetails.products[req.body.index].productId.discount) * cartDetails.products[req.body.index].quantity;
    const quantity= cartDetails.products[req.body.index].quantity;
    // console.log(quantity,price,"66666666666666666666");
    const totalAmount= await cartFunction.totalAmount(cartDetails);
    return res.json({message: "the product is incremented",quantity,price,totalAmount });

},
    //-----------------------delete product in the cart--------------------------//

    deleteCart:async function(req,res,next){
        
        let productId=req.body.product;
        let userId=req.session.userId;
        // console.log(userId,productId,"5555555555555555");
        const cartDetails = await Cart.find( { userId : userId } );
        const deletes = await Cart.updateOne({ userId : userId },{ $pull : {products: {productId : req.body.product } } });

        res.status(200).json({message: "The product is successfully removed from the cart"});

    },


    
}