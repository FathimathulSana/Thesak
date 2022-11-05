const Address = require("../model/addressModel");
const Cart = require("../model/cartModel");
const cartFunction = require("../controller/cart-function");
const Coupon = require("../model/couponModel");
const Count = require("../controller/cartWishlist-count");

module.exports = {
  checkout: async function (req, res, next) {
    try {
      const userLoggedIn = req.session.userLoggedIn;
      const userId = req.session.userId;
      const addressData = await Address.find({ userId: userId }).lean();
      let cartCount = await Count.getCartCount(req, res);
      let wishlistCount = await Count.getWishlistCount(req, res);
      const cartData = await Cart.findOne({ userId: userId })
        .populate("products.productId")
        .lean();
      const totalAmount = await cartFunction.totalAmount(cartData);
      const couponData = await Coupon.find().lean();
      res.render("user/checkout", {
        addressData,
        cartData,
        totalAmount,
        layout: "user-layout",
        couponData,
        userLoggedIn,
        cartCount,
        wishlistCount,
      });
    } catch (error) {
      next(error);
    }
console.log("hello ivda ethye");

  },
  billingAddress: async function (req, res, next) {
    const userId = req.session.userId;
    const address = await Address.findOne({
      userId: userId,
      _id: req.body.address,
    });
    res.json({ message: "successful", address });
  },
};
