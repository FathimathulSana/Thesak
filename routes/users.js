const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const app = require('../app');
const sessionCheck = require('../middleware/session')

const userController = require("../controller/user-controller");
const adminController=require('../controller/admin-controller');
const cartController = require("../controller/cart-controller");


const bcrypt = require("bcrypt");


 router.get('/',userController.getHome) ;
 router.get('/Login',userController.getLogin);
 router.post('/Login',userController.LoginAction);


 router.get('/userSignupPage',userController.getSignup);
 router.post('/signup',userController.SignupAction);
 router.get('/login',userController.getLogin);
 router.get('/userLogout',userController.getLogout)
//  router.get('/userLogout',userController.userLogout)
//   router.get('/signup',userController.getUserLogin);
 router.get('/otp',sessionCheck.userSession,userController.getOtp);
router.post('/otp',sessionCheck.userSession,userController.postOtp);

//product view//

router.get('/quickView/:id/',userController.getProductView);   
 
 //cart//

 router.get('/addToCart/:id',sessionCheck.userSession,cartController.addToCart);
 

module.exports = router;
