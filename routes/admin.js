const express = require('express');
const app = require('../app');
const router = express.Router();
const adminController=require('../controller/admin-controller');

/* Login page*/
router.get('/',adminController.getAdmin);
router.post('/',adminController.getAdminPanel);
router.get("/admin",adminController.getAdminPanels)
router.get('/allUsers',adminController.getUsers);
 router.get('/logout',adminController.logout);
router.get('/blocked/:id',adminController.getBlocked);
router.get('/unblocked/:id',adminController.getUnBlocked);

//router.get('/admin-panel',adminController.getAdminPanel);
 //router.post('/admin-login',adminController.adminLoginAction);



// get home page//


module.exports = router;
