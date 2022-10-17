const User = require("../model/userModel");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const mongoose = require("mongoose");
const session =require("express-session")
const Category = require("../model/categoryModel");
const Cart = require("../model/cartModel");
const Product = require("../model/productModel");

const admin=('../model/userModel');


//-----------------add-to-cart---------------------//

exports.addToCart=async function(req,res){
    
}