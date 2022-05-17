const path = require('path');
const express = require('express');
const pictureController = require('../controllers/userPicture');
const middlewares = require('../middlewares/middlewares');
const router = express.Router();

router.get('/getPictures', middlewares.isNotAuthFetch, pictureController.getAllPicturesUser);
router.post('/savePicture', middlewares.isNotAuthFetch, pictureController.saveUserPicture);
router.delete('/deletePicture/:id', middlewares.isNotAuthFetch, pictureController.deleteUserPicture);
router.delete('/deleteAllPictures', middlewares.isNotAuthFetch, pictureController.deleteAllUserPictures);

module.exports = router;