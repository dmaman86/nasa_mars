const path = require('path');
const express = require('express');
const userController = require('../controllers/userAuth');
const middlewares = require('../middlewares/middlewares');
const router = express.Router();

// route to validate email user in db
router.post('/validUserInfo', userController.firstRegister);
// route to save user db
router.post('/saveUser', middlewares.validRegistrationTime, userController.save_user);
// route to validate email && password user
router.post('/login', userController.login);
// route to logout, destroy session user and redirect
router.get('/logout', userController.logOut);

module.exports = router;