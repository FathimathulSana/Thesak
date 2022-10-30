const express = require("express");
const router = express.Router();
const fs=require('fs');
const multer=require('multer');
const session = require("express-session");

const adminController = require("../controller/admin-controller");

const User = require("../model/userModel");
const { updateOne, find } = require("../model/userModel");
const Category = require("../model/categoryModel");
const Product = require("../model/productModel");
const { render } = require("../app");
const Order = require("../model/orderModel");
const orderController = require("./order-controller");
const admin=('../model/adminModel');

module.exports = {
    viewOrders :async function(req,res,next){
        try {
            let orderData = await Order.find().sort( { createdAt : -1 } ).populate('userId').lean()
            res.render('admin/view-orders',{layout : 'admin-layout' , orderData});
        } catch (error) {
            next(error)
        }
    },

    getEditStatus : async function(req,res,next){
        try {
            let orderId = req.params.id;
            let orderData = await Order.findOne({ _id : orderId }).lean();
            let placed , shipped , delivered , cancelled;
            if( orderData.status == 'placed') { placed = true }
            else if( orderData.status == 'shipped' ) { shipped = true }
            else if( orderData.status == 'delivered' ) { delivered = true }
            else if ( orderData.status == 'cancelled' ) { cancelled = true }
            res.render('admin/edit-status',{ layout : 'admin-layout' ,orderData,placed,shipped,delivered,cancelled });
        } catch (error) {
            next(error)
        }
    },

    postEditStatus : async function(req,res,next){
        try{
           let orderId = req.params.id;
           await Order.findOneAndUpdate( { _id : orderId }, { $set : { status : req.body.status } } );
           res.redirect('/admin/viewOrders');

        }catch(error){
            next(error)
        }
    }
}