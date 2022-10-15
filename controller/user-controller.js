const User = require("../model/userModel");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const mongoose = require("mongoose");
const session =require("express-session")
const Category = require("../model/categoryModel");
const otpController = require('../controller/otp-controller');
const Product = require("../model/productModel");

const admin=('../model/userModel');

exports.getHome=async function(req,res,next){
  let products = await Product.find().populate('category').lean();
   let userLoggedIn=req.session.userLoggedIn;
   let username = req.session.name;
   res.render('index',{userLoggedIn,products,layout:'user-layout'})
   
}
exports.getLogout=function(req,res){
  req.session.userLoggedIn = false;
  console.log("logged out");
  res.redirect('/');
}
exports.getLogin=function(req,res,next){
    res.render('user/userLogin');
}
exports.LoginAction=async function(req,res,next){
    // console.log('dfghj')
    if(!req.body.email || !req.body.password) return res.render('user//userLogin',{loginerr: true})
    let products = await Product.find().populate('category').lean();
    const userData=await User.findOne({email:req.body.email});
    console.log(userData);
    if(!userData) return res.render('user//userLogin',{msg:'user not found'})
    // console.log('user not found');
    const correct=await bcrypt.compare(req.body.password,userData.password);
    if(!correct) return res.render('user//userLogin',{msg:'password incorrect'})
    if(userData.active == false) res.render('user//userLogin',{msg:'User does not exist'})
    req.session.userLoggedIn=true;
    res.redirect('/');
}

exports.getSignup=function(req,res,next){
    res.render('user/userSignup');
}
// exports.getUserLogin=function(req,res,next){
//     res.render('user/userLogin');
// }
exports.SignupAction=async function(req,res,next){

  const userData=await User.findOne({email:req.body.email});
  if(userData) return res.render('user//userSignup',{msg:'user already exist,enter a different mail id'});

    const newUser=new User({
        fname:req.body.fname,
        lname:req.body.lname,
        email:req.body.email,
        phonenumber:req.body.phonenumber,
        password:req.body.password,
        confirmpassword:req.body.confirmpassword
    });
    newUser.save();
    req.session.userLoggedIn=true;
    req.session.userId = newUser._id;
    // console.log(req.body,"1111")
    req.session.phonenumber = req.body.phonenumber;
   otpController.sendOtp(req.body.phonenumber)
   res.render('user/otp')
}

//otp//


exports.getOtp = function (req, res, next) {

   let userLoggedIn = req.session.userLoggedIn;
    // console.log( "otpeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    res.render('user/otp', { userLoggedIn })
  }
exports.postOtp = function (req, res, next) {
  let userId= req.session.id;
  console.log(userId,"userID")
 console.log(req.body,"reqboy")
    otpController.verifyOtp(req.body.otp, req.session.phonenumber).then((response) => {
         

        if (response) {
          // console.log(response, "dataaaaaaaaaaaaaaaaaaaaaaaa");
          // let userId= req.session.id
          User.findOneAndUpdate({ userId }, { $set: { otpVerified: true } })
          res.redirect('/Login')
        }
        else {
            // console.log("haloooooooooooooooooooooooooooooooooooo")
          res.redirect('/userSignupPage')
        }
    
      });
    

}