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
const admin=('../model/adminModel');



//----------------------------------------------------------------------------------//
const adminMail="admin@thesak.com";
const adminPassword=12345678;
//---------------------------------------------------------------------------------//

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
exports.getAdminPanels=function(req,res,next){
    try{
    
    res.render("admin/admin-panel",{layout:'admin-layout'});

    }catch(error){
        next(error)
    }
}

//------------------------post-admin-login------------------//
exports.getAdminPanel=function(req,res,next){
    try{

    if((adminMail==req.body.email) && (adminPassword==req.body.password)){
        req.session.loggedIn=true;
    
        res.render("admin/admin-panel",{layout:'admin-layout'});
    }else{
        // res.send("password or id incorrect");
        req.session.loginerr = true;
        res.render('admin/admin-login',{loginerr: req.session.loginerr});
        req.session.loginerr = false;
    }
}catch(error){
    next(error)
}
};
//-------------------------------------------------------------------------------------------//

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
        console.log('ethi');
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
    console.log(req.params.id)
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
//--------------------------------------------------------------------------//
    
