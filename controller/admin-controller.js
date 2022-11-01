const express = require("express");
const router = express.Router();
const fs=require('fs');
const multer=require('multer');
const bcrypt = require("bcrypt");
const session = require("express-session");
const Admin = require('../model/adminModel')
const User = require("../model/userModel");
const { updateOne, find } = require("../model/userModel");
const Order= require('../model/orderModel');


//---------------------------------------------------------------------------------//
exports.getAddAdmin = function(req,res,next){
    try {
        res.render('admin/add-admin',{layout : 'admin-layout'});
    } catch (error) {
        next(error)
    }
}

exports.postAddAdmin =async function(req,res,next){
    try {
        const adminData=await Admin.findOne({email:req.body.email});
        if(adminData) return res.render('admin//add-admin',{layout:'admin-layout',msg:'admin already exist,enter a different mail id'});
      
          const newAdmin = await Admin.create(req.body);
          res.redirect('/admin/admin');
    } catch (error) {
        next(error)
    }
}
//-------------------admin-login-page-----------------------//
exports.getAdmin=function(req,res,next){
    try{

    let loggedIn=req.session.loggedIn;
    if(loggedIn){
        res.render("admin/admin-panel",{layout:'admin-layout'})
    }
    else
    {
    res.render('admin/admin-login');
    }
    }catch(error){

        next(error)
}
 
}
//-------------------get-admin-panel----------------------//
exports.getAdminPanels= async function(req,res,next){
    try{
        let delivered = await Order.find({ status: 'delivered' }, { status: 1, _id: 0 }).lean()
        let deliveredCount = delivered.length
        let shipped = await Order.find({ status: 'shipped' }, { status: 1, _id: 0 }).lean()
        let shippedCount = shipped.length
        let cancelled = await Order.find({ status: 'cancelled' }, { status: 1, _id: 0 }).lean()
        let cancelledCount = cancelled.length
        let placed = await Order.find({ status: 'placed' }, { status: 1, _id: 0 }).lean()
        let placedCount = placed.length
    
        let orderData = await Order.find().populate('products.productId').lean()
        const deliveredOrder = orderData.filter(e => e.status == 'delivered')
        const TotalRevenue = deliveredOrder.reduce((accr, crr) => accr + crr.grandTotal, 0)
        const eachDaySale = await Order.aggregate([{ $match: { status: "delivered" } }, { $group: { _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, total: { $sum: "$grandTotal" } } }]).sort({ _id: -1 })
        let today = new Date()
        res.render("admin/admin-panel", { admin: req.session.admin,  layout: "admin-layout", deliveredCount, shippedCount, cancelledCount, placedCount, TotalRevenue, eachDaySale });
    }catch(error){
        next(error)
    }
}

//------------------------post-admin-login------------------//
exports.getAdminPanel=async function(req,res,next){
 try{
       if(!req.body.email || !req.body.password) return res.render('admin//admin-login',{loginerr: true})

       const adminData=await Admin.findOne({email:req.body.email});
       if(!adminData) return res.render('admin//admin-login',{msg:'admin not found'})

       const correct=await bcrypt.compare(req.body.password,adminData.password);
       if(!correct) return res.render('admin//admin-login',{msg:'password incorrect'})
       req.session.loggedIn=true;
       res.render('admin/admin-panel',{layout : 'admin-layout'});

}catch(error){
    next(error)
}
};


//------------------------get-users-------------------------//
exports.getUsers=async function(req,res,next){
    try{

    const userDetails=await User.find().lean();
    res.render('admin/view-users',{userDetails,layout:'admin-layout'});
    }catch(error){
        next(error)
    }
};

    exports.logout=function (req, res, next) {
        try{
        req.session.destroy();
        res.redirect('/admin');
        }
    catch(error){
        next(error)
    }
};

//----------------------block-users-----------------------//
exports.getBlocked=async function(req,res,next){
    try{
     await User.updateOne({_id:req.params.id},{$set:{active:false}})
     res.redirect('/admin/allUsers');
    }catch(error){
        next(error)
    }
}


//--------------------------unblock-users------------------------------//

exports.getUnBlocked=async function(req,res,next){
    try{
    await User.updateOne({_id:req.params.id},{$set:{active:true}})
    res.redirect('/admin/allUsers')
}catch(error){
    next(error)
}
}

    
