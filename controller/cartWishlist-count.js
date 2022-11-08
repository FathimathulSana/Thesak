const Cart = require("../model/cartModel");
const Wishlist = require("../model/wishlistModel");

module.exports = {
  getCartCount: async function (req, res, next) {
    try {
      let userId = req.session.userId;
      let cartCount = 0;
      if (userId) {
        let cart = await Cart.findOne({ userId: userId }).lean();
        if (cart) {
          cartCount = cart.products.length;
        }
      }
      return cartCount;
    } catch (error) {
      next(error);
    }
  },

  getWishlistCount: async function (req, res, nex) {
    try {
      let userId = req.session.userId;
      let wishlistCount = 0;
      if (userId) {
        let wishlist = await Wishlist.findOne({ userId: userId }).lean();
        if (wishlist) {
          wishlistCount = wishlist.products.length;
        }
      }
      return wishlistCount;
    } catch (error) {
      next(error);
    }
  },
};
