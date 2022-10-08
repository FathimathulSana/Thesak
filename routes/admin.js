const express = require('express');
const app = require('../app');
const router = express.Router();
const adminController=require('../controller/admin-controller');
const mongoose=require('mongoose');


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

router.post('/add-category',adminController.getAddCategories)
// get home page//


module.exports = router;
