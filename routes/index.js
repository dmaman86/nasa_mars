const path = require('path');
const express = require('express');
const indexController = require('../controllers/index');
const middlewares = require('../middlewares/middlewares');
const router = express.Router();

router.get('/', middlewares.isLooged);
router.get('/register', middlewares.isNotAuth, indexController.register);
router.get('/register/setPassword', middlewares.isNotAuthRegister, middlewares.currentUser, indexController.register_password);
router.get('/login', indexController.get_login);
router.get('/home', middlewares.isAuth, middlewares.currentUser, indexController.get_home);


module.exports = router;