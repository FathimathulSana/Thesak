const Cart = require("../model/cartModel");
const Wishlist = require("../model/wishlistModel");

module.exports = {
    getCartCount : async function(req,res,next){
        try {
            let userId = req.session.userId;
            let cartData = await Cart.findOne({ userId : userId }).lean();
            let cartCount = 0;
            if(cartData){
                cartCount = cartData.products.length;
                return cartCount;
            }
        } catch (error) {
            next(error)
        }
    },

    getWishlistCount : async function(req,res,nex){
        try{
        let userId = req.session.userId;

        let wishlistData = await Wishlist.findOne({ userId : userId }).lean();
        let wishlistCount = 0;
        if(wishlistData){
            wishlistCount = wishlistData.products.length;
            return wishlistCount;
        }
    }catch(error){
    next(error)
}
    }
}