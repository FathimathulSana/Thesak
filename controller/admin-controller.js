const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin-controller");
const User = require("../model/userModel");
const fs=require('fs');
const { updateOne, find } = require("../model/userModel");
const Category = require("../model/categoryModel");
const multer=require('multer');
const session = require("express-session");

const Product = require("../model/productModel");

const admin=('../model/adminModel');


//----------------------------------------------------------------------------------//
const adminMail="admin@thesak.com";
const adminPassword=12345678;
//---------------------------------------------------------------------------------//

//admin login page//
exports.getAdmin=function(req,res,next){
    let loggedIn=req.session.loggedIn;
    if(loggedIn){
        res.render("admin/admin-panel",{layout:'admin-layout'})
    }
    else
    {
    res.render('admin/admin-login');
    }
}
//get admin panel//
exports.getAdminPanels=function(req,res){
    
    res.render("admin/admin-panel",{layout:'admin-layout'})
}


exports.getAdminPanel=function(req,res,next){
    if((adminMail==req.body.email) && (adminPassword==req.body.password)){
        req.session.loggedIn=true;
    
        res.render("admin/admin-panel",{layout:'admin-layout'});
    }else{
        // res.send("password or id incorrect");
        req.session.loginerr = true;
        res.render('admin/admin-login',{loginerr: req.session.loginerr});
        req.session.loginerr = false;
    }
};
//-------------------------------------------------------------------------------------------//

//get users//
exports.getUsers=async function(req,res){
    const userDetails=await User.find().lean();
    res.render('admin/view-users',{userDetails,layout:'admin-layout'});
};

    exports.logout=function (req, res, next) {
        console.log('ethi');
        req.session.destroy();
        res.redirect('/admin');
        };


//block users//
exports.getBlocked=async function(req,res){
    console.log(req.params.id)
     await User.updateOne({_id:req.params.id},{$set:{active:false}})
     

    res.redirect('/admin/allUsers')
}


//unblock users//

exports.getUnBlocked=async function(req,res){
 await User.updateOne({_id:req.params.id},{$set:{active:true}})

    res.redirect('/admin/allUsers')
}
//--------------------------------------------------------------------------//

