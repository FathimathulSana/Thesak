const User = require('../model/userModel')
const Product = require("../model/productModel");
let Cart = require("../model/cartModel");
const Order = require('../model/orderModel');
//const razorpayController = require('../controller/razorpayController')
const cartFunction = require('../controller/cart-function');
const { totalAmount } = require('../controller/cart-function');
const Coupon = require('../model/couponModel');


module.exports = {
    confirmOrderButton : async function(req,res,next){
        try {
            userId = req.session.userId
            let cartData = await Cart.findOne({ userId: userId }).populate('products.productId').lean()
            var totalAmount = await cartFunction.totalAmount(cartData);
            let totalAmounts = totalAmount * 100;

            if (req.session.coupon) {

                let discountAmount = req.session.coupon.discountAmount;

                var totalAmount = totalAmount - discountAmount
                //add userID to coupon //
                await Coupon.findOneAndUpdate({ _id: req.session.coupon._id }, { $set: { users: userId } })

            }

            let orderData = await Order.create({ userId: userId, "billingAddress": req.body, "products": cartData.products, "status": "placed", "paymentMethod": req.body.paymentMethod, grandTotal: totalAmount })


            orderDataPopulated = await Order.findOne({ _id: orderData._id }).populate("products.productId").lean();



            req.session.orderData = orderData
            if (orderData.paymentMethod == 'COD') {
                req.session.orderData = null;

                req.session.confirmationData = { orderDataPopulated, totalAmount };
                res.json({ status: "COD", totalAmounts, orderData })
            } else if (orderData.paymentMethod == 'Online Payment') {
                let orderData = req.session.orderData
                req.session.orderData = null;
                razorData = await razorpayController.generateRazorpy(orderData._id, totalAmounts)

                await Order.findOneAndUpdate({ _id: orderData._id }, { orderId: razorData.id });
                razorId = process.env.RAZOR_PAY_ID;

                req.session.confirmationData = { orderDataPopulated, totalAmount };

                res.json({ message: 'success', totalAmounts, razorData, orderData });
            }
        } catch (error) {
            next(error)
        }

    },
    confirmationPage: async (req, res, next) => {
        try {
            await Cart.findOneAndDelete({ userId: userId })
            let orderDataPopulated = req.session.confirmationData.orderDataPopulated
            let totalAmount = req.session.confirmationData.totalAmount;

            res.render('user/orderConform', { orderDataPopulated, totalAmount });
        } catch (error) {
            next(error)
        }
    },
    
}