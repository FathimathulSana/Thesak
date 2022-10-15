const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin-controller");
const User = require("../model/userModel");
const fs=require('fs');
const { updateOne, find } = require("../model/userModel");
const Category = require("../model/categoryModel");
const multer=require('multer');
const session = require("express-session");

const Product = require("../model/productModel");

const admin=('../model/adminModel');




//  category 


exports.getCategory=async function(req,res){
    const categoryDetails=await Category.find().lean();
    res.render('admin/view-category',{categoryDetails,layout:'admin-layout'});
};

//get add-category//

exports.getAddCategory=function(req,res){
    res.render('admin/add-category',{layout:'admin-layout'});
}

//get edit-category//
exports.getEdit=async function(req,res){
   
    const data=await Category.findOne({ _id:req.params.id },{category:1}).lean();
     let id=req.params.id;
    res.render('admin/edit-category',{data,id,layout:'admin-layout'});
}

//edit category//

exports.getEdited=async function(req,res){
    console.log('ivide ethiii');
     await Category.findOneAndUpdate({_id:req.params.id},{
        $set:{
            category:req.body.category
        }
     });
     console.log(req.body);
    res.redirect('/admin/category');
   
}

//Delete category//

exports.getDeleteCategory=async function(req,res){
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/admin/category')
}


//add category//

exports.getAddCategories=async function(req,res,next){
  const category_data=await Category.find();
  if(category_data.length>0){
    console.log(req.body.category)
    let checking=false;
    for(let i=0;i<category_data.length;i++){
        if(category_data[i]['category'].toLowerCase() === req.body.category.toLowerCase()){
            console.log('ethi ehti');
            checking=true;
            break;
        }
    }
    if(checking == false){
        const newCategory=new Category({
            category:req.body.category
        });
        newCategory.save();
        console.log(req.body.category);
        res.redirect('/admin/category');
    }else{
        res.render('admin//add-category',{layout:'admin-layout',msg:'This category is alredy exist'})
    }

  }
   
}

// -------------------------------------------------------------------//
