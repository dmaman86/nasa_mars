'use strict';

const { Picture } = require('../models');

/**
 * this function is to send all pictures of user login
 * @param req
 * @param res all pictures user saved
 * @returns {Promise<*>}
 */
const getAllPicturesUser = async(req, res) => {
    const id_user = parseInt(req.session.user.id);
    try {
        const pictures = await Picture.findAll( { where: { id_user: id_user } } );
        return res.status(201).send({ pictures: pictures});
    } catch (error) {
        return res.status(500).send(error);
    }
}
/**
 * this function is to save picture in db
 * @param req picture information by post
 * @param res if success
 * @returns {Promise<*>}
 */
const saveUserPicture = async(req, res) => {
    const {id_photo_nasa, image_src, earth_date, sol_date, camera, mission } = req.body;
    const id_user = req.session.user.id;
    const pic_user = new LocalPicture(id_user, id_photo_nasa, image_src, earth_date, sol_date, camera, mission);

    try {
        const found = await Picture.findOne({ where: { id_user: pic_user.id_user, url_picture: pic_user.url_picture } } );
        if(found)
            return res.status(400).send({ message: 'The image is already saved.'});
        else{
            try {
                const new_picture = await Picture.create(pic_user);
                return res.status(201).send({});
            } catch (error) {
                return res.status(500).send(error);
            }
        }
    } catch (error) {
        return res.status(500).send(error);
    }
}
/**
 * this function is to delete picture by id in db
 * @param req id picture to delete
 * @param res if success
 * @returns {Promise<*>}
 */
const deleteUserPicture = async(req, res) => {
    const id_user = parseInt(req.session.user.id);
    const id_pic_by_nasa = parseInt(req.params.id);

    try {
        await Picture.destroy( { 
            where: { id_user: id_user, id_photo_nasa: id_pic_by_nasa }
        } );
        return res.status(201).send( { message: `Picture with id: ${id_pic_by_nasa} was deleted.`} );
    } catch (error) {
        return res.status(500).send(error);
    }
}
/**
 * this function is to delete all pictures of current user
 * @param req
 * @param res if success
 * @returns {Promise<void>}
 */
const deleteAllUserPictures = async(req, res) => {
    const id_user = parseInt(req.session.user.id);
    try {
        await Picture.destroy({
            where: { id_user: id_user },
            truncate: true
        });
        res.status(201).send( { message: 'All pictures have been successfully deleted.'} );
    } catch (error) {
        res.status(500).send(error);
    }
}

const LocalPicture = class{
    constructor(user_id, photo_nasa_id, url_picture, earth_date, sol, camera, mission) {
        this.id_user = parseInt(user_id);
        this.id_photo_nasa = parseInt(photo_nasa_id);
        this.url_picture = url_picture;
        this.earth_date = earth_date;
        this.sol = parseInt(sol);
        this.camera = camera;
        this.mission = mission;
    }
}


module.exports = {
    getAllPicturesUser,
    saveUserPicture,
    deleteUserPicture,
    deleteAllUserPictures
}