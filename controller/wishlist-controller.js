// const { rawListeners } = require("../app");
let wishList = require("../model/wishlistModel");
const Category = require("../model/categoryModel");
const Count = require("../controller/cartWishlist-count");
module.exports = {
  //------------------------get-wishlist-----------------------//

  getWishList: async function (req, res, next) {
    try {
      const userLoggedIn = req.session.userLoggedIn;
      const userId = req.session.userId;
      let categoryDetails = await Category.find().lean();
      let cartCount = await Count.getCartCount(req, res);
      let wishlistCount = await Count.getWishlistCount(req, res);
      const wishlistData = await wishList
        .findOne({ userId: userId })
        .populate("products.productId")
        .lean();
      if (wishlistData) {
        if (wishlistData.products[0]) {
          return res.render("user/wish-list", {
            wishlistData,
            layout: "user-layout",
            userLoggedIn,
            categoryDetails,
            cartCount,
            wishlistCount,
          });
        }
        res.render("user/empty-wishlist", {
          layout: "user-layout",
          categoryDetails,
          userLoggedIn,
          cartCount,
          wishlistCount,
        });
      } else {
        res.render("user/empty-wishlist", {
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

  //--------------------------add-wishlist-----------------------------//

  postWishList: async function (req, res, next) {
    try {
      const productId = req.body.product;
      const userId = req.session.userId;

      const wishlist = await wishList.findOne({ userId: userId }).lean();
      if (wishlist) {
        const productExist = await wishList.findOne({
          userId: userId,
          "products.productId": productId,
        });

        if (productExist)
          return res.json({ message: "product already added to wishList" });
        await wishList.findOneAndUpdate(
          { userId: userId },
          { $push: { products: { productId: productId } } }
        );
      } else {
        await wishList.create({
          userId: userId,
          products: { productId: productId },
        });
      }
      const wishlistData = await wishList
        .findOne({ userId: userId })
        .populate("products.productId")
        .lean();

      const price =
        wishlistData.products[0].productId.price -
        wishlistData.products[0].productId.discount;

      await wishList.updateOne(
        { userId: userId, "products.productId": productId },
        { "products.$.price": price }
      );
    } catch (error) {
      next(error);
    }
  },

  //-------------------delete-wishlist-------------------//
  deleteWishlist: async function (req, res, next) {
    try {
      const userId = req.session.userId;
      const productId = req.body.productId;
      const deleteWishlist = await wishList.updateOne(
        { userId: userId },
        { $pull: { products: { productId: req.body.productId } } }
      );
      res.json({});
    } catch (error) {
      next(error);
    }
  },
};
