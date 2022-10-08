const User = require("../model/userModel");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const mongoose = require("mongoose");
const session =require("express-session")
const Category = require("../model/categoryModel");

const admin=('../model/userModel');

exports.getHome=async function(req,res,next){
    const categoryDetails=await Category.find().lean();
    res.render('index',{categoryDetails,layout:'user-layout'})
}
exports.getLogin=function(req,res,next){
    res.render('user/userLogin');
}
exports.LoginAction=async function(req,res,next){
    console.log('dfghj')
    if(!req.body.email || !req.body.password) return res.render('user//userLogin',{loginerr: true})

    const userData=await User.findOne({email:req.body.email});
    console.log(userData);
    if(!userData) return res.render('user//userLogin',{msg:'user not found'})
    console.log('user not found');
    const correct=await bcrypt.compare(req.body.password,userData.password);
    if(!correct) return res.render('user//userLogin',{msg:'password incorrect'})
    req.session.userLoggedin = true;
     res.render('index',{layout:'user-layout',user:true})
}

exports.getSignup=function(req,res,next){
    res.render('user/userSignup');
}
// exports.getUserLogin=function(req,res,next){
//     res.render('user/userLogin');
// }
exports.SignupAction=function(req,res,next){
    const newUser=new User({
        fname:req.body.fname,
        lname:req.body.lname,
        email:req.body.email,
        phonenumber:req.body.phonenumber,
        password:req.body.password,
        confirmpassword:req.body.confirmpassword
    });
    newUser.save();
    res.render('user/userLogin');
}

