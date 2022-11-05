// const mongoose = require("mongoose");
const Coupon = require("../model/couponModel");

module.exports = {
  //---------------get coupon-page--------------//
  getCoupon: async function (req, res, next) {
    try {
      const couponData = await Coupon.find().lean();
      res.render("admin/coupon-table", { layout: "admin-layout", couponData });
    } catch (error) {
      next(error);
    }
  },

  //----------------get-add-coupons------------------//
  getAddCoupon: function (req, res, next) {
    try {
      res.render("admin/add-coupon", { layout: "admin-layout" });
    } catch (error) {
      next(error);
    }
  },

  //--------------post-add-coupons----------------//

  postAddCoupon: async function (req, res, next) {
    try {
      const couponnameExist = await Coupon.find({
        couponName: req.body.couponName,
      }).lean();
      const couponcodeExist = await Coupon.find({
        couponCode: req.body.couponCode,
      }).lean();
      if (couponnameExist[0] || couponcodeExist[0])
        return res.render("admin//add-coupon", {
          msg: "The coupon is already exist",
          layout: "admin-layout",
        });

      await Coupon.create(req.body);
      res.redirect("/admin/coupon");
    } catch (error) {
      next(error);
    }
  },

  //------------------get-edit-coupon-----------------//
  getEditCoupon: async function (req, res, next) {
    try {
      id = req.params.id;
      couponData = await Coupon.find({ _id: id }).lean();
      console.log(couponData);
      couponData[0].expiryDate = couponData[0].expiryDate
        .toISOString()
        .substring(0, 10);
      couponData = couponData[0];
      res.render("admin/edit-coupon", { layout: "admin-layout", couponData });
    } catch (error) {
      next(error);
    }
  },

  //-------------------post-edit-coupon----------------------//

  postEditCoupon: async function (req, res, next) {
    try {
      id = req.params.id;
      await Coupon.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            couponName: req.body.couponName,
            couponCode: req.body.couponCode,
            discountAmount: req.body.discountAmount,
            minAmount: req.body.minAmount,
            expiryDate: req.body.expiryDate,
          },
        }
      );
      res.redirect("/admin/coupon");
    } catch (error) {
      next(error);
    }
  },
  deleteCoupon: async function (req, res, next) {
    try {
      console.log(req.body.couponId,'couponid')
      let couponId = req.body.couponId;
      await Coupon.deleteOne({ _id : couponId });
      res.json({});
    } catch (error) {
      next(error);
    }
  },

  validateCoupon: async (req, res, next) => {
    try {
      userId = req.session.userId;
      couponExist = await Coupon.findOne({
        couponCode: req.body.couponId,
        users: userId,
      }).lean();
      coupons = await Coupon.findOne({ couponCode: req.body.couponId }).lean();
      currentDate = new Date();

      if (coupons) {
        if (couponExist) {
          return res.json({ message: "used already" });
        }
        if (currentDate > coupons.expiryDate)
          return res.json({ message: "coupon expired" });

        if (Number(req.body.total) < Number(coupons.minAmount)) {
          return res.json({ message: "less than minimum" });
        }

        couponTotal = req.body.total - coupons.discountAmount;
        req.session.coupon = coupons;
        return res.json({ message: "succesfull", coupons, couponTotal });
      }
      return res.json({ message: "invalid coupon" });
    } catch (error) {
      next(error);
    }
  },
};
