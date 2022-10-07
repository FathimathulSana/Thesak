const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const app = require('../app');

const userController = require("../controller/user-controller");

const bcrypt = require("bcrypt");


 router.get('/',userController.getHome) ;
 router.get('/Login',userController.getLogin);
 router.post('/Login',userController.LoginAction);

 router.get('/userSignupPage',userController.getSignup);
 router.post('/signup',userController.SignupAction);
 router.get('/login',userController.getLogin);
//  router.get('/userLogout',userController.userLogout)
//   router.get('/signup',userController.getUserLogin);
 
 
 
 

module.exports = router;
