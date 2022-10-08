const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin-controller");
const User = require("../model/userModel");
const fs=require('fs');
const { updateOne, find } = require("../model/userModel");
const Category = require("../model/categoryModel");

const admin=('../model/adminModel');


const adminMail="admin@thesak.com";
const adminPassword=12345678;

exports.getAdmin=function(req,res,next){
    res.render('admin/admin-login',{layout:'signup-layout'});
}
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
exports.getUsers=async function(req,res){
    const userDetails=await User.find().lean();
    res.render('admin/view-users',{userDetails,layout:'admin-layout',admin:true});
};

    exports.logout=function (req, res, next) {
        console.log('ethi');
        req.session.destroy();
        res.redirect('/admin');
        };

exports.getBlocked=async function(req,res){
    console.log(req.params.id)
     await User.updateOne({_id:req.params.id},{$set:{active:false}})
     

    res.redirect('/admin/allUsers')
}
exports.getUnBlocked=async function(req,res){
 await User.updateOne({_id:req.params.id},{$set:{active:true}})

    res.redirect('/admin/allUsers')
}


//  category 
exports.getCategory=async function(req,res){
    const categoryDetails=await Category.find().lean();
    res.render('admin/view-category',{categoryDetails,layout:'admin-layout',admin:true});
};
exports.getAddCategory=function(req,res){
    res.render('admin/add-category',{layout:'admin-layout',admin:true});
}

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
