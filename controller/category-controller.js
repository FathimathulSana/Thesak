const express = require("express");
const session = require("express-session");
const router = express.Router();
const multer=require('multer');
const fs=require('fs');
const adminController = require("../controller/admin-controller");


const { updateOne, find } = require("../model/userModel");
const Category = require("../model/categoryModel");
const User = require("../model/userModel");
const Product = require("../model/productModel");
const admin=('../model/adminModel');


//--------------------------get-category---------------------------------// 


exports.getCategory=async function(req,res,next){
    try{

    const categoryDetails=await Category.find().lean();
    res.render('admin/view-category',{categoryDetails,layout:'admin-layout'});
    }catch(error){
        next(error)
    }
};

//--------------------------get-add-category-----------------------------//

exports.getAddCategory=function(req,res,next){
    try{
    res.render('admin/add-category',{layout:'admin-layout'});
    }catch(error){
        next(error)
    }
}

//-------------------------get-edit-category-------------------------//
exports.getEdit=async function(req,res,next){
   try{
    const data=await Category.findOne({ _id:req.params.id },{category:1}).lean();
     let id=req.params.id;
    res.render('admin/edit-category',{data,id,layout:'admin-layout'});
     
     }catch(error){
          next(error)
      }
}

//---------------------------poat-edit-category--------------------------//

exports.getEdited=async function(req,res,next){
    try{ 

   
     await Category.findOneAndUpdate({_id:req.params.id},{
        $set:{
            category:req.body.category
        }
     });
     console.log(req.body);
    res.redirect('/admin/category');

    }catch(error){
          next(error)
}
   
}

//---------------------Delete-category-------------------------//

exports.getDeleteCategory=async function(req,res,next){
    try{

    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/admin/category');

    }catch(error){
          next(error)
}
}


//----------------------add-category------------------------//

exports.getAddCategories=async function(req,res,next){
try{ 

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
}catch(error){
    next(error)
}
   
}

// -------------------------------------------------------------------//
