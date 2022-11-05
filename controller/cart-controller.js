const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const session = require("express-session");

const cartFunction = require("../controller/cart-function");
const Count = require("../controller/cartWishlist-count");

const Cart = require("../model/cartModel");
const Category = require("../model/categoryModel");

//-----------------add-to-cart---------------------//

module.exports = {
  addToCart: async function (req, res, next) {
    try {
      const productId = req.body.productId;
      let userId = req.session.userId;
      const cart = await Cart.findOne({ userId: userId }).lean();
      if (cart) {
        productExist = await Cart.findOne({
          userId: userId,
          "products.productId": productId,
        });
        if (productExist) {
          await Cart.updateOne(
            { userId: userId, "products.productId": productId },
            { $inc: { "products.$.quantity": 1 } }
          );
          res.json({ message: "success" });
        } else {
          await Cart.findOneAndUpdate(
            { userId: userId },
            { $push: { products: { productId: productId, quantity: 1 } } }
          );
          res.json({ message: "success" });
        }
      } else {
        await Cart.create({
          userId: userId,
          products: { productId: productId, quantity: 1 },
        });
        res.json({ message: "success" });
      }
    } catch (error) {
      next(error);
    }
  },

  // --------------------view cart-----------------------//

  getViewCart: async function (req, res, next) {
    try {
      let userLoggedIn = req.session.userLoggedIn;
      let userId = req.session.userId;
      let categoryDetails = await Category.find().lean();
      let cartCount = await Count.getCartCount(req, res);
      let wishlistCount = await Count.getWishlistCount(req, res);
      cartDetails = await Cart.findOne({ userId: userId })
        .populate("products.productId")
        .lean();
      let totalAmount;
      if (cartDetails) {
        //check whether cart is empty//
        if (cartDetails.products[0]) {
          totalAmount = await cartFunction.totalAmount(cartDetails);
          return res.render("user/view-cart", {
            categoryDetails,
            cartDetails,
            totalAmount,
            layout: "user-layout",
            userLoggedIn,
            cartCount,
            wishlistCount,
          });
        }
        res.render("user/empty-cart", {
          layout: "user-layout",
          categoryDetails,
          userLoggedIn,
          cartCount,
          wishlistCount,
        });
      } else {
        res.render("user/empty-cart", {
          layout: "user-layout",
          categoryDetails,
          userLoggedIn,
          cartCount,
          wishlistCount,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  //---------------------------increment-amount---------------------------------//

  changeQuantity: async (req, res, next) => {
    try {
      if (req.body.count == -1 && req.body.quantity == 1) {
        res.json({ minquantity: true, totalAmount });
      } else {
        await Cart.updateOne(
          { _id: req.body.cartId, "products.productId": req.body.prodId },
          { $inc: { "products.$.quantity": req.body.count } }
        );
        let cartData = await Cart.findOne({ _id: req.body.cartId })
          .populate("products.productId")
          .lean();
        let price =
          cartData.products[req.body.index].productId.price *
          cartData.products[req.body.index].quantity;
        let totalAmount = await cartFunction.totalAmount(cartData);
        res.json({ status: true, price, totalAmount });
      }
    } catch (error) {
      next(error);
    }
  },
  //-----------------------delete product in the cart--------------------------//

  deleteCart: async function (req, res, next) {
    try {
      let productId = req.body.product;
      let userId = req.session.userId;
      const cartDetails = await Cart.find({ userId: userId });
      const deletes = await Cart.updateOne(
        { userId: userId },
        { $pull: { products: { productId: req.body.product } } }
      );
      res
        .status(200)
        .json({ message: "The product is successfully removed from the cart" });
    } catch (error) {
      next(error);
    }
  },
};
