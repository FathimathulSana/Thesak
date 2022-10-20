const { rawListeners } = require("../app");
let product = require("../model/productModel");
let wishList = require('../model/wishlistModel');
const Category = require("../model/categoryModel");

module.exports={
    getWishList : async function(req,res){
        const userLoggedIn=req.session.userLoggedIn;
          const userId=req.session.userId;
          let categoryDetails = await Category.find().lean();
          const wishlistData= await wishList.findOne( { userId : userId } ).populate( "products.productId" ).lean();
          
          res.render('user/wish-list',{wishlistData,layout:'user-layout',userLoggedIn,categoryDetails});
    },

    postWishList: async function(req,res){
        
      
        const productId=req.body.product;
        const userId=req.session.userId;

        const wishlist = await wishList.findOne( {userId : userId} ).lean();
        if(wishlist){
            const productExist= await wishList.findOne({ userId : userId , "products.productId" : productId });

            if(productExist)
                return res.json({ message : 'product already added to wishList'});
                await wishList.findOneAndUpdate({ userId: userId }, { $push: { products: { productId: productId } } });

            
        }

        else{
            await wishList.create({ userId : userId , products : { productId : productId }})
        }
        const wishlistData = await wishList.findOne({ userId : userId }).populate('products.productId').lean();

        const price = (wishlistData.products[0].productId.price - wishlistData.products[0].productId.discount);

        await wishList.updateOne({ userId : userId , "products.productId" : productId }, {"products.$.price" : price });

    },

    deleteWishlist: async function(req,res){

       const userId = req.session.userId;
       const productId = req.body.productId;
        const deleteWishlist = await wishList.updateOne({ userId : userId },{ $pull : { products : { productId : req.body.productId} } });
        res.json({});

    }

}