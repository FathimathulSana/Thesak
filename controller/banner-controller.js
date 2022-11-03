const Banner = require("../model/bannerModel");
const Product = require("../model/productModel");
const fs = require("fs");
const { nextTick } = require("process");

module.exports = {
  getBanner: async function (req, res, next) {
    try {
      let bannerData = await Banner.find({}).populate("product").lean();
      res.render("admin/view-banner", { layout: "admin-layout", bannerData });
    } catch (error) {
      next(error);
    }
  },

  getAddBanner: async function (req, res, next) {
    try {
      let productData = await Product.find().lean();
      res.render("admin/add-banner", { layout: "admin-layout", productData });
    } catch (error) {
      next(error);
    }
  },

  postAddBanner: async function (req, res, next) {
    try {
      req.body.image = req.file.filename;
      await Banner.create(req.body);
      res.redirect("/admin/banner");
    } catch (error) {
      next(error);
    }
  },

  getEditBanner: async function (req, res, next) {
    try {
      let bannerId = req.params.id;
      let bannerData = await Banner.findOne({ _id: bannerId })
        .populate("product")
        .lean();
      let productData = await Product.find().lean();
      res.render("admin/edit-banner", {
        layout: "admin-layout",
        bannerData,
        productData,
      });
    } catch (error) {
      next(error);
    }
  },

  postEditBanner: async function (req, res, next) {
    try {
      if (req.body.heading) {
        await Banner.findOneAndUpdate(
          { _id: req.params.id },
          { heading: req.body.heading }
        );
      }
      if (req.body.subHeading) {
        await Banner.findOneAndUpdate(
          { _id: req.params.id },
          { subHeading: req.body.subHeading }
        );
      }
      if (req.body.productId) {
        await Banner.findOneAndUpdate(
          { _id: req.params.id },
          { productId: req.body.productId }
        );
      }
      if (req.body.product) {
        await Banner.findOneAndUpdate(
          { _id: req.params.id },
          { product: req.body.product }
        );
      }
      if (req.file) {
        imagePath = await Banner.findOne(
          { _id: req.params.id },
          { _id: 0, image: 1 }
        );
        fs.unlinkSync("public/bannerImageUploads/" + imagePath.image);
        req.body.image = req.file.filename;
        await Banner.findOneAndUpdate(
          { _id: req.params.id },
          { image: req.body.image }
        );
      }
      res.redirect("/admin/banner");
    } catch (error) {
      next(error);
    }
  },

  deleteBanner: async function (req, res, next) {
    try {
      let bannerId = req.body.bannerId;
      imagePath = await Banner.findOne({ _id: bannerId }, { _id: 0, image: 1 });
      fs.unlinkSync("public/bannerImageUploads/" + imagePath.image);
      await Banner.findOneAndDelete({ _id : bannerId });
      res.json({});
    } catch (error) {
      next(error);
    }
  },
};
