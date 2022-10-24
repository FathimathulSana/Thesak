const express = require("express");
const router = express.Router();
const session = require("express-session");
const multer=require('multer');
const fs=require('fs');

const adminController = require("../controller/admin-controller");

const User = require("../model/userModel");
const { updateOne, find } = require("../model/userModel");
const Category = require("../model/categoryModel");
const Product = require("../model/productModel");
const admin=('../model/adminModel');


//----------------------------product-management--------------------------------//

exports.getProducts=async function(req,res,next){
  try{

    const productDetails=await Product.find().populate('category').lean();
    res.render('admin/view-products',{productDetails,layout:'admin-layout'});

  }catch(error){
    next(error)
}
}

//-----------------get-add-product---------------------//
exports.getAddProduct= async function(req,res,next){
  try{

    const categoryData=await Category.find().lean();
    res.render('admin/add-product',{categoryData,layout:'admin-layout'});

  }catch(error){
    next(error)
}
}

//-------------------add-product--------------------//
exports.postAddProduct=async function(req,res,next){
  try{

    console.log("req.body::",req.body);
    console.log("uploaded",req.files);
        let productName = await Product.findOne({ productname: req.body.productname }).lean();
        console.log(productName);
        if (productName) return res.send("product already exists");
       
        const arrImages = req.files.map((value) => value.filename);
        console.log(arrImages);
        req.body.imagepath = arrImages;
       
        
        await Product.create(req.body);
        res.redirect("/admin/products");

      }catch(error){
        next(error)
    }
      };

   //--------------------get-editProductPage------------------------//

   exports.getEditProduct=async function(req,res,next){
try{

    const id=req.params.id;
    const productData=await Product.findOne({_id:id}).lean();
    const categoryData=await Category.find().lean()
    res.render('admin/edit-products',{productData,categoryData,layout:'admin-layout'});

  }catch(error){
    next(error)
}

   };

   //-------------------------edit-products-----------------------------//
   exports.postEditProduct=async function(req,res,next){
    try{

    console.log("postedited");
    const arrImages = req.files.map((value) => value.filename);
    if(arrImages[0]){
        const imageData=await Product.findOne({_id:req.params.id},{imagepath:1 , _id:0}).lean();
        console.log(imageData);
        imageData.imagepath.map((i) => fs.unlinkSync('public/productImageUploads/'+i));
        req.body.imagepath = arrImages;
        await Product.findOneAndUpdate({ _id : req.params.id },
          {
            $set: { 
                productname: req.body.productname ,
                category: req.body.category,
                stock:req.body.stock,
                price:req.body.price,
                discount:req.body.discount,
                description:req.body.description,
                imagepath:req.body.imagepath
            },
          }
        );
      } else {
        await Product.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
                productname: req.body.productname ,
                category: req.body.category,
                stock:req.body.stock,
                price:req.body.price,
                discount:req.body.discount,
                description:req.body.description,
            }
          }
        );
      }
      console.log(req.body);
       res.redirect('/admin/products');

      }catch(error){
        next(error)
    }
   };

   //---------------delete-product-----------------//

   exports.getDeleteProduct=async function(req,res,next){
    try{

    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products');

  }catch(error){
    next(error)
}
   }