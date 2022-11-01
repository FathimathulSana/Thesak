const bcrypt = require("bcrypt");

const User = require("../model/userModel");
const Address = require("../model/addressModel");
const Count = require("../controller/cartWishlist-count");

module.exports = {
  // ------------------------get-profilePage-----------------//
  getProfile: async function (req, res, next) {
    try {
      const userLoggedIn = req.session.userLoggedIn;
      const userId = req.session.userId;
      let cartCount = await Count.getCartCount(req, res);
      let wishlistCount = await Count.getWishlistCount(req, res);
      const userDetails = await User.findOne({ _id: userId }).lean();
      const addressData = await Address.find({ userId: userId }).lean();

      res.render("user/user-profile", {
        userDetails,
        addressData,
        layout: "user-layout",
        userLoggedIn,
        cartCount,
        wishlistCount,
      });
    } catch (error) {
      next(error);
    }
  },

  // ------------------------get-address-page--------------------//

  getAddress: function (req, res, next) {
    try {
      const userLoggedIn = req.session.userLoggedIn;
      res.render("user/address", { layout: "user-layout", userLoggedIn });
    } catch (error) {
      next(error);
    }
  },

  // -----------------------------add-address----------------------//
  postAddress: async function (req, res, next) {
    try {
      const userId = req.session.userId;
      req.body.userId = userId;

      await Address.create(req.body);
      res.redirect("/profile");
    } catch (error) {
      next(error);
    }
  },

  // -----------------delete-address-------------------------//
  deleteAddress: async function (req, res, next) {
    try {
      const addressId = req.body.addressId;

      await Address.findOneAndDelete({ _id: addressId });

      res.json({});
    } catch (error) {
      next(error);
    }
  },

  // ----------------edit-Address--------------------//
  editAddress: async function (req, res, next) {
    try {
      const userId = req.session.userId;
      const addressId = req.params.id;
      await Address.findOneAndUpdate(
        { _id: addressId },
        {
          $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            landmark: req.body.landmark,
          },
        }
      );

      res.redirect("/profile");
    } catch (error) {
      next(error);
    }
  },

  //--------------------------change-username--------------------------//

  changeUsername: async function (req, res, next) {
    try {
      const userId = req.session.userId;
      await User.findOneAndUpdate(
        { _id: userId },
        { $set: { fname: req.body.name } }
      );
      res.json({});
    } catch (error) {
      next(error);
    }
  },

  // -------------------------change-password-------------------------//

  changePassword: async function (req, res, next) {
    try {
      const userId = req.session.userId;
      const userData = await User.findOne({ _id: userId }).lean();

      const correct = await bcrypt.compare(req.body.oldpass, userData.password);

      if (correct) {
        const newpassword = await bcrypt.hash(req.body.newpass, 10);
        await User.findOneAndUpdate(
          { _id: userId },
          { $set: { password: newpassword } }
        );

        res.json({});
      } else alert("");
    } catch (error) {
      next(error);
    }
  },
};
