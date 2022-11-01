const express = require('express');
const app = require('../app');
const router = express.Router();
const mongoose=require('mongoose');
const multer = require('multer');
const path = require('path');
const sessionCheck = require('../middleware/session')
const upload = require('../middleware/imageMulter');
const uploads = require('../middleware/bannerMulter');

const adminController=require('../controller/admin-controller');
const productController=require('../controller/product-controller');
const categoryController=require('../controller/category-controller');
const couponController=require('../controller/coupon-controller');
const adminOrderController=require('../controller/adminOrder-controller');
const bannerController=require('../controller/banner-controller');


/* Login page*/
router.get('/',adminController.getAdmin);
router.post('/',adminController.getAdminPanel);
router.get("/admin",sessionCheck.adminSession,adminController.getAdminPanels)
router.get('/logout',adminController.logout);
router.get('/addAdmin',sessionCheck.adminSession,adminController.getAddAdmin);
router.post('/AddAdmin',sessionCheck.adminSession,adminController.postAddAdmin);

/*User management*/
router.get('/allUsers',sessionCheck.adminSession,adminController.getUsers);

router.get('/blocked/:id',sessionCheck.adminSession,adminController.getBlocked);
router.get('/unblocked/:id',sessionCheck.adminSession,adminController.getUnBlocked);

 /*category management */
router.get('/category',sessionCheck.adminSession,categoryController.getCategory);
router.get('/add-category',sessionCheck.adminSession,categoryController.getAddCategory);

router.post('/add-category',sessionCheck.adminSession,categoryController.getAddCategories);
router.get('/edit-category/:id',sessionCheck.adminSession,categoryController.getEdit);
 router.post('/edit-categories/:id',sessionCheck.adminSession,categoryController.getEdited);

 router.get('/delete-category/:id',sessionCheck.adminSession,categoryController.getDeleteCategory);

 /*product management*/

 router.get('/products',sessionCheck.adminSession,productController.getProducts);
 router.get('/add-product',sessionCheck.adminSession,productController.getAddProduct);
 router.post('/add-product' ,sessionCheck.adminSession,upload.array('images', 4),productController.postAddProduct);
 router.get('/edit-products/:id',sessionCheck.adminSession,productController.getEditProduct);
 router.post('/edit-products/:id',sessionCheck.adminSession,upload.array('images',4),productController.postEditProduct);
 router.get('/delete-products/:id',sessionCheck.adminSession,productController.getDeleteProduct)

 /*coupon management */
 router.get('/coupon',sessionCheck.adminSession,couponController.getCoupon);
 router.get('/addCoupon',sessionCheck.adminSession,couponController.getAddCoupon);
 router.post('/addCoupon',sessionCheck.adminSession,couponController.postAddCoupon);
 router.get('/editCoupon/:id',sessionCheck.adminSession,couponController.getEditCoupon);
 router.post('/editCoupon/:id',sessionCheck.adminSession,couponController.postEditCoupon);
 router.get('/deleteCoupon/:id',sessionCheck.adminSession,couponController.deleteCoupon);


 /*orders management */

 router.get('/viewOrders',sessionCheck.adminSession,adminOrderController.viewOrders);
 router.get('/editStatus/:id',sessionCheck.adminSession,adminOrderController.getEditStatus);
 router.post('/postEditStatus/:id',sessionCheck.adminSession,adminOrderController.postEditStatus);

/*Banner management */

router.get('/Banner',sessionCheck.adminSession,bannerController.getBanner); 
router.get('/addBanner',sessionCheck.adminSession,bannerController.getAddBanner);
router.post('/addBanner',uploads.single('image'),sessionCheck.adminSession,bannerController.postAddBanner);
router.get('/EditBanner/:id',sessionCheck.adminSession,bannerController.getEditBanner);
router.post('/editBanner/:id',uploads.single('image'),sessionCheck.adminSession,bannerController.postEditBanner);
router.get('/deleteBanner/:id',sessionCheck.adminSession,bannerController.deleteBanner);

// -----------error-page-render------------//

router.use((req,res,next) => {
    //next(createError(404))
    res.render("admin/admin-error")
})

router.use((err,req,res,next) => {
    console.log("admin error route handler");
    res.status(err.status || 500);
    res.render('admin/admin-error')
})

module.exports = router;
