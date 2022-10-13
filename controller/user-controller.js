const User = require("../model/userModel");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const mongoose = require("mongoose");
const session =require("express-session")
const Category = require("../model/categoryModel");
const otpController = require('../controller/otp-controller');

const admin=('../model/userModel');

exports.getHome=async function(req,res,next){
    const categoryDetails=await Category.find().lean();
    res.render('index',{categoryDetails,layout:'user-layout',notuser:true})
}
exports.getLogin=function(req,res,next){
    res.render('user/userLogin');
}
exports.LoginAction=async function(req,res,next){
    console.log('dfghj')
    if(!req.body.email || !req.body.password) return res.render('user//userLogin',{loginerr: true})
    const categoryDetails=await Category.find().lean();
    const userData=await User.findOne({email:req.body.email});
    console.log(userData);
    if(!userData) return res.render('user//userLogin',{msg:'user not found'})
    console.log('user not found');
    const correct=await bcrypt.compare(req.body.password,userData.password);
    if(!correct) return res.render('user//userLogin',{msg:'password incorrect'})
    if(userData.active == false) res.render('user//userLogin',{msg:'User does not exist'})
    req.session.userLoggedIn=true;
     res.render('index',{categoryDetails,layout:'user-layout'})
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
    req.session.userId = newUser._id
   req.session.loggedIn = true;
    req.session.phonenumber = req.body.phonenumber;
   otpController.sendOtp(req.body.phonenumber)
   res.render('user/otp')
}

//otp//


exports.getOtp = function (req, res, next) {
    // let userLoggedIn = req.session.loggedIn
    console.log( "sdfghjkl")
    res.render('user/otp')
  }
exports.postOtp = function (req, res, next) {
    otpController.verifyOtp(req.body, req.session.body).then((response) => {

        if (response) {
          console.log(data, "dataaaaaaaaaaaaaaaaaaaaaaaa")
    
          User.findOneAndUpdate({ _id: req.session.userId }, { $set: { otpVerified: true } });
          res.redirect('/Login')
        }
        else {
            console.log("haloooooooooooooooooooooooooooooooooooo")
          res.redirect('/userSignupPage')
        }
    
      });
    

}