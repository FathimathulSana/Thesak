const express = require('express');
const app = require('../app');
const router = express.Router();
const adminController=require('../controller/admin-controller');
const mongoose=require('mongoose');
 const multer = require('multer');
 const path = require('path');
 


 //set storage engine-multer//

 

 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/productImageUploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null,uniqueSuffix + '-' +file.originalname   )
    }
});
const upload = multer({ storage: storage });




/* Login page*/
router.get('/',adminController.getAdmin);
router.post('/',adminController.getAdminPanel);
router.get("/admin",adminController.getAdminPanels)
router.get('/logout',adminController.logout);

/*User management*/
router.get('/allUsers',adminController.getUsers);

router.get('/blocked/:id',adminController.getBlocked);
router.get('/unblocked/:id',adminController.getUnBlocked);

 /*category management */
router.get('/category',adminController.getCategory);
router.get('/add-category',adminController.getAddCategory);

router.post('/add-category',adminController.getAddCategories);
router.get('/edit-category/:id',adminController.getEdit);
 router.post('/edit-categories/:id',adminController.getEdited);

 router.get('/delete-category/:id',adminController.getDeleteCategory);

 /*product management*/

 router.get('/products',adminController.getProducts);
 router.get('/add-product',adminController.getAddProduct);
 router.post('/add-product' ,upload.array('images', 4),adminController.postAddProduct);
 router.get('/edit-products/:id',adminController.getEditProduct);
 router.post('/edit-products/:id',upload.array('images',4),adminController.postEditProduct);


module.exports = router;
