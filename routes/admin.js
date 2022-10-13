const express = require('express');
const app = require('../app');
const router = express.Router();
const adminController=require('../controller/admin-controller');
const mongoose=require('mongoose');
 const multer = require('multer');
 const path = require('path');
 const sessionCheck = require('../middleware/session')


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
router.get("/admin",sessionCheck.adminSession,adminController.getAdminPanels)
router.get('/logout',adminController.logout);

/*User management*/
router.get('/allUsers',sessionCheck.adminSession,adminController.getUsers);

router.get('/blocked/:id',sessionCheck.adminSession,adminController.getBlocked);
router.get('/unblocked/:id',sessionCheck.adminSession,adminController.getUnBlocked);

 /*category management */
router.get('/category',sessionCheck.adminSession,adminController.getCategory);
router.get('/add-category',sessionCheck.adminSession,adminController.getAddCategory);

router.post('/add-category',sessionCheck.adminSession,adminController.getAddCategories);
router.get('/edit-category/:id',sessionCheck.adminSession,adminController.getEdit);
 router.post('/edit-categories/:id',sessionCheck.adminSession,adminController.getEdited);

 router.get('/delete-category/:id',sessionCheck.adminSession,adminController.getDeleteCategory);

 /*product management*/

 router.get('/products',sessionCheck.adminSession,adminController.getProducts);
 router.get('/add-product',sessionCheck.adminSession,adminController.getAddProduct);
 router.post('/add-product' ,sessionCheck.adminSession,upload.array('images', 4),adminController.postAddProduct);
 router.get('/edit-products/:id',sessionCheck.adminSession,adminController.getEditProduct);
 router.post('/edit-products/:id',sessionCheck.adminSession,upload.array('images',4),adminController.postEditProduct);
 router.get('/delete-products/:id',sessionCheck.adminSession,adminController.getDeleteProduct)


module.exports = router;
