const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin-controller");
const User = require("../model/userModel");
const fs=require('fs');
const { updateOne, find } = require("../model/userModel");
const Category = require("../model/categoryModel");
const multer=require('multer');

const Product = require("../model/productModel");

const admin=('../model/adminModel');

//----------------------------------------------------------------------------------//
const adminMail="admin@thesak.com";
const adminPassword=12345678;
//---------------------------------------------------------------------------------//

//admin login page//
exports.getAdmin=function(req,res,next){
    res.render('admin/admin-login',{layout:'signup-layout'});
}
//get admin panel//
exports.getAdminPanels=function(req,res){
    res.render("admin/admin-panel",{layout:'admin-layout',admin:true})
}


exports.getAdminPanel=function(req,res,next){
    if((adminMail==req.body.email) && (adminPassword==req.body.password)){
        req.session.adminLoggedIn = true;
    
        res.render("admin/admin-panel",{layout:'admin-layout',admin:true});
    }else{
        // res.send("password or id incorrect");
        req.session.loginerr = true;
        res.render('admin/admin-login',{layout:'signup-layout',loginerr: req.session.loginerr});
        req.session.loginerr = false;
    }
};
//-------------------------------------------------------------------------------------------//

//get users//
exports.getUsers=async function(req,res){
    const userDetails=await User.find().lean();
    res.render('admin/view-users',{userDetails,layout:'admin-layout',admin:true});
};

    exports.logout=function (req, res, next) {
        console.log('ethi');
        req.session.destroy();
        res.redirect('/admin');
        };


//block users//
exports.getBlocked=async function(req,res){
    console.log(req.params.id)
     await User.updateOne({_id:req.params.id},{$set:{active:false}})
     

    res.redirect('/admin/allUsers')
}


//unblock users//

exports.getUnBlocked=async function(req,res){
 await User.updateOne({_id:req.params.id},{$set:{active:true}})

    res.redirect('/admin/allUsers')
}
//--------------------------------------------------------------------------//

//  category 


exports.getCategory=async function(req,res){
    const categoryDetails=await Category.find().lean();
    res.render('admin/view-category',{categoryDetails,layout:'admin-layout',admin:true});
};

//get add-category//

exports.getAddCategory=function(req,res){
    res.render('admin/add-category',{layout:'admin-layout',admin:true});
}

//get edit-category//
exports.getEdit=async function(req,res){
   
    const data=await Category.findOne({ _id:req.params.id },{cname:1}).lean();
     let id=req.params.id;
    res.render('admin/edit-category',{data,id,layout:'admin-layout',admin:true});
}

//edit category//

exports.getEdited=async function(req,res){
    console.log('ivide ethiii');
     await Category.findOneAndUpdate({_id:req.params.id},{
        $set:{
            cname:req.body.cname
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
    console.log(req.body.cname)
    let checking=false;
    for(let i=0;i<category_data.length;i++){
        if(category_data[i]['cname'].toLowerCase() === req.body.cname.toLowerCase()){
            console.log('ethi ehti');
            checking=true;
            break;
        }
    }
    if(checking == false){
        const newCategory=new Category({
            cname:req.body.cname
        });
        newCategory.save();
        console.log(req.body.cname);
        res.redirect('/admin/category');
    }else{
        res.render('admin//add-category',{layout:'admin-layout',msg:'This category is alredy exist',admin:true})
    }

  }
   
}

// -------------------------------------------------------------------//
//product management//

exports.getProducts=async function(req,res){
    const productDetails=await Product.find().populate('cname').lean();
    res.render('admin/view-products',{productDetails,layout:'admin-layout',admin:true});
}

//get add-product//
exports.getAddProduct= async function(req,res){
    const categoryData=await Category.find().lean();
    res.render('admin/add-product',{categoryData,layout:'admin-layout',admin:true});
}

//post add-product//
exports.postAddProduct=async function(req,res){
    console.log("req.body::",req.body);
    console.log("uploaded",req.files);
        let productName = await Product.findOne({ productname: req.body.productname }).lean();
        console.log(productName);
        if (productName) return res.send("product already exists");
        // console.log(req.files);
        //  const files=req.body.images;
        const arrImages = req.files.map((value) => value.filename);
        console.log(arrImages);
        req.body.imagepath = arrImages;
        // console.log(req.body);
        // console.log(req.body)
        
        await Product.create(req.body);
        res.redirect("/admin/products");
      };

   //get edit-product//

   exports.getEditProduct=async function(req,res){

    const id=req.params.id;
    const productData=await Product.findOne({_id:id}).lean();
    const categoryData=await Category.find().lean()
    res.render('admin/edit-products',{productData,categoryData,layout:'admin-layout',admin:true});

   };

   //post edit-products//
   exports.postEditProduct=async function(req,res){
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
                cname: req.body.cname,
                stock:req.body.stock,
                price:req.body.price,
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
                cname: req.body.cname,
                stock:req.body.stock,
                price:req.body.price,
                description:req.body.description,
            }
          }
        );
      }
      console.log(req.body);
       res.redirect('/admin/products');
   };