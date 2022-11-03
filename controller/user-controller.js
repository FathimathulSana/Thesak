const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const mongoose = require("mongoose");
const session = require("express-session");

const otpController = require("../controller/otp-controller");

const Banner = require("../model/bannerModel");
const Category = require("../model/categoryModel");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const Count = require("../controller/cartWishlist-count");

//-------------------------get-homePage--------------------------//
exports.getHome = async function (req, res, next) {
  try {
    const products = await Product.find().populate("category").lean();
    const userLoggedIn = req.session.userLoggedIn;

    const username = req.session.name;
    const categoryDetails = await Category.find().lean();
    const bannerData = await Banner.find().populate("product").lean();
    let cartCount = await Count.getCartCount(req, res);
    let wishlistCount = await Count.getWishlistCount(req, res);

    res.render("index", {
      userLoggedIn,
      products,
      categoryDetails,
      layout: "user-layout",
      bannerData,
      cartCount,
      wishlistCount,
    });
  } catch (error) {
    next(error);
  }
};

//---------------------------------log-out-----------------------------------//

exports.getLogout = function (req, res, next) {
  try {
    req.session.userLoggedIn = false;
    console.log("logged out");
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

// ----------------------get-LoginPage------------------------//
exports.getLogin = function (req, res, next) {
  try {
    res.render("user/userLogin");
  } catch (error) {
    next(error);
  }
};

//-------------------------add-login------------------------------//

exports.LoginAction = async function (req, res, next) {
  try {
    if (!req.body.email && !req.body.password)
      return res.render("user//userLogin", { msg : 'invalid email and password' });
    let products = await Product.find().populate("category").lean();
    const userData = await User.findOne({ email: req.body.email });
    if (!userData)
      return res.render("user//userLogin", { msg: "user not found" });
    const correct = await bcrypt.compare(req.body.password, userData.password);
    if (!correct)
      return res.render("user//userLogin", { msg: "password incorrect" });
    if (userData.active == false)
      res.render("user//userLogin", { msg: "User does not exist" });
    req.session.userLoggedIn = true;
    req.session.userId = userData._id;
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

//-----------------------------get-signupPage-------------------------//

exports.getSignup = function (req, res, next) {
  try {
    res.render("user/userSignup");
  } catch (error) {
    next(error);
  }
};

//---------------------------post-signup--------------------------//
exports.SignupAction = async function (req, res, next) {
  try {
    const userData = await User.findOne({ email: req.body.email });
    if (userData)
      return res.render("user//userSignup", {
        msg: "user already exist,enter a different mail id",
      });
    const newUser = await User.create(req.body);
    req.session.userLoggedIn = true;
    const id = newUser._id;
    otpController.sendOtp(newUser);
    res.render("user/otp", { id });
  } catch (error) {
    next(error);
  }
};

// -----------------------add-otp-------------------------//
exports.postOtp = async function (req, res, next) {
  try {
    const userdata = await User.findOne({ _id: req.params.id }).lean();
    let otps = req.body.otp;
    let verification = await otpController.verifyOtp(otps, userdata);
    if (verification) {
      req.session.userLogin = true;
      req.session.userId = userdata._id;
      res.redirect("/Login");
    } else {
      await User.findOneAndDelete({ _id: req.params.id }).lean();
      res.redirect("/userSignupPage");
    }
  } catch (error) {
    next(error);
  }
};

// ----------------------product-view----------------------//

exports.getProductView = async function (req, res, next) {
  try {
    let userLoggedIn = req.session.userLoggedIn;
    let id = req.params.id;
    let products = await Product.find().lean();
    let cartCount = await Count.getCartCount(req, res);
    let wishlistCount = await Count.getWishlistCount(req, res);

    let productDetails = await Product.find({ _id: id })
      .populate("category")
      .lean();
    let categoryDetails = await Category.find().lean();

    res.render("user/product-view", {
      layout: "user-layout",
      productDetails,
      categoryDetails,
      products,
      userLoggedIn,
      cartCount,
      wishlistCount,
    });
  } catch (error) {
    next(error);
  }
};
// ------------------forgot-password-----------------//

exports.getForgotPassword = function(req,res,next){
  try{
  res.render('user/forgot-password');
  }catch(error){
    next(error)
  }
};

exports.postForgotPassword = async function(req,res,next){
  try {
    let userData = await User.findOne({email : req.body.email});
    if(userData){
      const newpassword = await bcrypt.hash(req.body.password, 10);
      await User.findOneAndUpdate(
        { $set: { password: newpassword , confirmpassword : newpassword} });
        res.redirect('/Login');
    }
    if(!userData || !req.body.email)
      return res.render("user//forgot-password", { msg : 'Enter correct email' });
    
  } catch (error) {
    next(error)
  }
};

// exports.postResetPassword = async function(req,res,next){
//   try {
//     const userData = await User.findOne({}).lean();
//      console.log(userData,"555555555");
//       const newpassword = await bcrypt.hash(req.body.password, 10);
//       await User.findOneAndUpdate(
//         { _id: userId },
//         { $set: { password: newpassword } })
   
      
//   } catch (error) {
//     next(error)
//   }
// }



