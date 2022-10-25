const Address = require('../model/addressModel')
const Cart = require("../model/cartModel");
const cartFunction = require('../controller/cart-function');
const Coupon = require('../model/couponModel')

module.exports = {
    checkout : async function(req,res,next){
        try{
            const userLoggedIn = req.session.userLoggedIn;
            const userId = req.session.userId;
            const addressData = await Address.find({ userId : userId}).lean();
            const cartData = await Cart.findOne({ userId : userId }).populate("products.productId").lean();
            const totalAmount = await cartFunction.totalAmount(cartData);
            const couponData = await Coupon.find().lean();
            res.render('user/checkout', { addressData , cartData , totalAmount ,layout : 'user-layout' ,couponData,userLoggedIn});
           

        }catch(error){
          next(error)
        }
    },
    billingAddress : async function(req,res,next){
        const userId = req.session.userId;
        const address = await Address.findOne({userId : userId , _id : req.body.address});
        res.json({ message : "successful" ,address});

    }
}