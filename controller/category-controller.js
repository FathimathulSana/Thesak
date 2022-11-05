// const express = require("express");
// const session = require("express-session");
// const router = express.Router();
// const { updateOne, find } = require("../model/userModel");
const Category = require("../model/categoryModel");

//--------------------------get-category---------------------------------//

exports.getCategory = async function (req, res, next) {
  try {
    const categoryDetails = await Category.find().lean();
    res.render("admin/view-category", {
      categoryDetails,
      layout: "admin-layout",
    });
  } catch (error) {
    next(error);
  }
};

//--------------------------get-add-category-----------------------------//

exports.getAddCategory = function (req, res, next) {
  try {
    res.render("admin/add-category", { layout: "admin-layout" });
  } catch (error) {
    next(error);
  }
};

//-------------------------get-edit-category-------------------------//
exports.getEdit = async function (req, res, next) {
  try {
    const data = await Category.findOne(
      { _id: req.params.id },
      { category: 1 }
    ).lean();
    let id = req.params.id;
    res.render("admin/edit-category", { data, id, layout: "admin-layout" });
  } catch (error) {
    next(error);
  }
};

//---------------------------poat-edit-category--------------------------//

exports.getEdited = async function (req, res, next) {
  try {
    await Category.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          category: req.body.category,
        },
      }
    );
    res.redirect("/admin/category");
  } catch (error) {
    next(error);
  }
};

//---------------------Delete-category-------------------------//

exports.getDeleteCategory = async function (req, res, next) {
  
  try {
    let catId = req.body.catId;
    console.log(catId,'categoryId')
    await Category.findByIdAndDelete(catId);
    res.json({});
  } catch (error) {
    next(error);
  }
};

//----------------------add-category------------------------//

exports.getAddCategories = async function (req, res, next) {
  try {
    const category_data = await Category.find();
    if (category_data.length > 0) {
      let checking = false;
      for (let i = 0; i < category_data.length; i++) {
        if (
          category_data[i]["category"].toLowerCase() ===
          req.body.category.toLowerCase()
        ) {
          checking = true;
          break;
        }
      }
      if (checking == false) {
        const newCategory = new Category({
          category: req.body.category,
        });
        newCategory.save();
        res.redirect("/admin/category");
      } else {
        res.render("admin//add-category", {
          layout: "admin-layout",
          msg: "This category is alredy exist",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};
