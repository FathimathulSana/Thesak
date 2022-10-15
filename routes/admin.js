const express = require('express');
const app = require('../app');
const router = express.Router();
const adminController=require('../controller/admin-controller');
const productController=require('../controller/product-controller');
const categoryController=require('../controller/category-controller');
const mongoose=require('mongoose');
 const multer = require('multer');
 const path = require('path');
 const sessionCheck = require('../middleware/session')
 const upload = require('../middleware/imageMulter')

/* Login page*/
router.get('/',adminController.getAdmin);
router.post('/',adminController.getAdminPanel);
router.get("/admin",sessionCheck.adminSession,adminController.getAdminPanels)
router.get('/logout',adminController.logout);

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


module.exports = router;
