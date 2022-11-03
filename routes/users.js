const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const app = require('../app');
const sessionCheck = require('../middleware/session')

const userController = require("../controller/user-controller");
const cartController = require("../controller/cart-controller");
const wishlistController = require('../controller/wishlist-controller');
const profileController = require('../controller/profile-controller');
const checkoutController = require('../controller/checkout-controller');
const couponController=require('../controller/coupon-controller');
const orderController=require('../controller/order-controller');


const bcrypt = require("bcrypt");


router.get('/',userController.getHome) ;
router.get('/Login',userController.getLogin);
router.post('/Login',userController.LoginAction);


router.get('/userSignupPage',userController.getSignup);
router.post('/signup',userController.SignupAction);
router.get('/login',userController.getLogin);
router.get('/userLogout',userController.getLogout)

 //-------------otp-------------//
router.post('/otp/:id',userController.postOtp);

//--------------------product view--------------//

router.get('/quickView/:id/',userController.getProductView);   
 
 //-------------------cart----------------------//

router.post('/addToCart',sessionCheck.userSession,cartController.addToCart);
router.get('/viewCart',sessionCheck.userSession,cartController.getViewCart)

router.post('/deleteCart',sessionCheck.userSession,cartController.deleteCart)
router.post('/changeQuantity',sessionCheck.userSession,cartController.changeQuantity);

 //-------------------wish-list----------------------//

router.get('/wishList',sessionCheck.userSession,wishlistController.getWishList);
router.post('/addToWishlist',sessionCheck.userSession,wishlistController.postWishList);
router.post('/deleteWishlist',sessionCheck.userSession,wishlistController.deleteWishlist);


 //-------------------profile---------------------------//

router.get('/profile',sessionCheck.userSession,profileController.getProfile);
router.get('/addAddress',sessionCheck.userSession,profileController.getAddress);
router.post('/submitAddress',sessionCheck.userSession,profileController.postAddress);
router.post('/deleteAddress',sessionCheck.userSession,profileController.deleteAddress);
router.post('/editAddress/:id',sessionCheck.userSession,profileController.editAddress);
router.patch('/changeUsername',sessionCheck.userSession,profileController.changeUsername);
router.patch('/changePassword',sessionCheck.userSession,profileController.changePassword);

 //--------------------checkout--------------------------//

router.get('/checkout',sessionCheck.userSession,checkoutController.checkout);
router.post('/billingAddress',sessionCheck.userSession,checkoutController.billingAddress);
router.post('/couponValidation',sessionCheck.userSession,couponController.validateCoupon);
router.post('/verifyRazorpay', sessionCheck.userSession, orderController.verifyPayment);

 //-----------------------order-------------------------//

router.post('/confirmOrderButton',sessionCheck.userSession,orderController.confirmOrderButton);
router.get('/confirmationPage', sessionCheck.userSession, orderController.confirmationPage);
router.get('/myOrders',sessionCheck.userSession,orderController.myOrders); 
router.post('/cancelOrder',sessionCheck.userSession,orderController.cancelOrder);


//--------------forgot-password-----------------//

router.get('/forgotPassword',userController.getForgotPassword);
router.post('/forgotPassword',userController.postForgotPassword);



module.exports = router;
