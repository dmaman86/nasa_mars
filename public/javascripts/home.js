'use strict';

import { connection_nasa, connection_user, missions_nasa } from './services_connection.js';
import { validatorSearching, validatorModule } from './services_validator.js';

const images = ( () => {

    let public_images = {};

    public_images.Images = class Images{
        constructor(id, date, camera, img_src, sol, mission){
            this.id_photo_nasa = id;
            this.earth_date = date;
            this.camera = camera;
            this.image_src = img_src;
            this.sol_date = sol;
            this.mission = mission;
        }

        /**
         * create card of some mission
         * @returns {ChildNode}
         */
         toHtmlCard(){
            let element_card = `
                <form id="${this.id_photo_nasa}">
                    <div class="col">
                        <div class="card">
                            <img src="${this.image_src}" class="card-img-top img-fuild" alt="${this.image_src}">
                            <div class="card-body">
                                <p class="card-text">Earth date: ${this.earth_date} <br>
                                                Sol date: ${this.sol_date}<br>
                                                Camera: ${this.camera}<br>
                                                Mission: ${this.mission}</p>

                                <button type="submit" class="btn btn-info">Save</button>
                                <button type="button" class="btn btn-primary">Full size</button>
                            </div>
                        </div>
                    </div>
                </form>`;
            return convertToDom(element_card);
        }
        /**
         * create li of some mission
         * @returns {ChildNode}
         */
        toHtmlUl(){
            let li = `<form id="${this.id_photo_nasa}">
                            <li>
                                <button type="submit" class="btn-close btn-danger" aria-label="Close"></button>
                                <a href ="${this.image_src}" class="link-primary h5" target="_blank">
                                    image id: ${this.id_photo_nasa}
                                </a>
                                <p>Earth date: ${this.earth_date}, Sol: ${this.sol_date}, Camera: ${this.camera}</p>
                            </li>
                        </form>`;
            return convertToDom(li);
        }
        /**
         * function: generate current button slide html
         * @param index
         * @returns {ChildNode}
         */
        getButton(index){
            let dagesh = index === 0 ? "class='active' aria-current='true'" : '';
            let button = `
                <button type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide-to="${index}"
                        aria-label="${this.mission}"
                        ${dagesh}></button>`;
            return convertToDom(button);
        }
        /**
         * function: generate current carousel html
         * @param index
         * @returns {ChildNode}
         */
        getCarousel(index){
            let element_carousel = `
            <div class="carousel-item ${index === 0 ? "active" : ""}">
                <img src="${this.image_src}" class="d-block w-100" alt="${this.image_src}">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${this.mission}</h5>
                        <p>${this.earth_date}</p>
                        <a href="${this.image_src}" class="btn btn-primary" role="button" target="_blank" aria-pressed="true">Full Size</a>
                    </div>
            </div>`;
            return convertToDom(element_carousel);
        }
    }

    public_images.messageErrorImages = (error) => {
        const message_error =  `<div class="alert alert-danger" role="alert">
                                Sorry but something wrong (${error.data}). Please try again later.
                            </div>`;
        return convertToDom(message_error)
    }

    public_images.notFoundImages = () => {
        const not_found =  `<div class="alert alert-warning h4" role="alert">No images found!.</div>`;
        return convertToDom(not_found);
    }
    /**
    * private function, this function convert string to validate html
    * @param element - assume is not empty or null and is html string
    * @returns {ChildNode}
    */
    const convertToDom = (element) => {
        const doc = new DOMParser().parseFromString(element, 'text/html');
        return doc.body.firstChild;
    }

    return public_images;

})();

/**
 * charge on the photos, creates html elements,
 * @type {{}}
 */
 const rover_photos = ( () => {

    let photos = {};
    /**
     * photos DS
     * @type {photos.Rovers}
     */
    photos.Rovers = class {
        constructor() {
            this.list = [];
        }
        /**
         * this function insert into data struct list of photos mission
         * @param photo_list
         */
        add(photo_list){
            this.clear();
            this.list = photo_list;
        }

        getItem(id){
            const index = this.list.findIndex( (element) => element.id_photo_nasa == id);
            return this.list[index];
        }
        /**
         * clear data struct
         */
        clear(){
            this.list.splice(0, this.list.length);
        }
        /**
         * this function generate list of cards
         * @returns {DocumentFragment}
         */
        generateHTML(){
            let fragment = document.createDocumentFragment();

            this.list.forEach( (element) => {
                let div_card = element.toHtmlCard();
                let button_fullSize = div_card.querySelector('.btn-primary');
                button_fullSize.addEventListener('click', function (event){
                    window.open(element.image_src, '_blank');
                });
                fragment.appendChild(div_card);
            });
            return fragment;
        }
    }

    return photos;
})();
/**
 * module to save selected images
 * @type {{}}
 */
 const saved_images = ( function () {

    let images = {};

    images.imagesList = class{
        constructor(){
            this.list_selected = [];
        }
        /**
         * save photo
         * @param element
         */
        add(element){
            this.list_selected.push(element);
        }

        setList(elements){
            this.list_selected = elements;
        }

        deleteItem(index){
            const found = this.list_selected.findIndex( (element) => element.id_photo_nasa == index);
            this.list_selected.splice(found, 1);
        }

        clear(){
            this.list_selected.splice(0, this.list_selected.length);
        }
        /**
         * generate buttons of carousel
         * @returns {DocumentFragment}
         */
        generateButtonsSlide(){
            let slides = document.createDocumentFragment();

            this.list_selected.forEach((element, index) => {
                slides.appendChild(element.getButton(index));
            });
            return slides;
        }
        /**
         * generate images of carousel
         * @returns {DocumentFragment}
         */
        generateCarouselItems(){
            let items = document.createDocumentFragment();

            this.list_selected.forEach((element, index) => {
                items.appendChild(element.getCarousel(index));
            });
            return items;
        }
    }

    return images;

})();

(function() {
    let mission_list = new missions_nasa.Missions();
    let rovers_list = new rover_photos.Rovers();
    let list_save = new saved_images.imagesList();

    let body_search = null;
    let carousel_indicators = null;
    let carousel_items = null;
    let place_rover = null;
    let modal_gif = null;
    let modal_confirm_all = null;
    let modal_confirm = null;
    let list_images_selected = null;
    let toogleFlag = true;

    const missions_names = ['Curiosity', 'Opportunity', 'Spirit'];
    /**
     * creates missions DS
     * goes to Nasa site and takes the earth and sol max dates
     */
    const getMissions = async () => {
        for(const mission of missions_names){
            let mission_values = await connection_nasa.initMission(mission);
            mission_list.add(mission_values.data);
        }
    }

    const displayPhotosUl = (photos) => {
        list_images_selected.innerHTML = '';
        for(const photo_saved of photos){
            const li_photo = photo_saved.toHtmlUl();
            li_photo.addEventListener('submit', removeFromList);
            displayButtonDelete(li_photo);
            list_images_selected.appendChild(li_photo);
        }
    }

    const displayButtonDelete = (photo) => {
        const button_edit = photo.querySelector('.btn-danger');
        if(!toogleFlag){
            button_edit.classList.remove('d-none');
        }else{
            button_edit.classList.add('d-none');
        }
    }

    const getPicturesSaves = async() => {
        const url = `/api/getPictures`;
        await connection_user.getAllPictures(url)
                            .then( (res) => {
                                let res_photos = [];
                                for(const photo_saved of res.pictures){
                                    const photo = new images.Images(photo_saved.id_photo_nasa,
                                        photo_saved.earth_date,
                                        photo_saved.camera,
                                        photo_saved.url_picture,
                                        photo_saved.sol,
                                        photo_saved.mission);
                                    res_photos.push(photo);
                                }
                                list_save.setList(res_photos);
                                displayPhotosUl(res_photos);
                            })
                            .catch( (err) =>{
                                window.location.pathname = err.redirect;
                            });
    }

    /**
     * function to display error message get from nasa server
     * @param error
     */
    const error_server = (error) => {
        body_search.innerHTML = '';
        body_search.appendChild(images.messageErrorImages(error));
    }
    /**
     * build a list of card to display
     * @param list
     */
     const display_photos_cards = (list) => {
        place_rover.innerHTML = "";
        if(!list.length){
            place_rover.appendChild(images.notFoundImages());
        }
        else{
            const photos_list = sanitizeResponsePhotos(list);
            rovers_list.add(photos_list);
            place_rover.appendChild(rovers_list.generateHTML());
            attachListenersSave();
        }
    }

    /**
     * this function validate all field get of form
     * @param date
     * @param mission
     * @param camera
     * @returns {boolean|*}
     */
    const validForm = (date, mission, camera) => {
        date.value = date.value.trim();
        let isNotEmptyDate = validatorModule.validateInput(date, validatorSearching.validNotEmpty);
        let isNotEmptyMission = validatorModule.validFieldChoose(mission, 'mission', validatorSearching.validChoose);
        let isNotEmptyCamera = validatorModule.validFieldChoose(camera, 'camera', validatorSearching.validChoose);

        let isInFormat = (isNotEmptyDate) ? validatorModule.validateInput(date, validatorSearching.validDateFormat) : false;
        let success = ( isNotEmptyDate && isNotEmptyMission && isNotEmptyCamera && isInFormat );

        if(success){
            let range = mission_list.validDateWithMission(mission.value.trim(), date.value);
            return validatorModule.displayError(date, range);
        }
        return success;
    }
    /**
     * this function validate form values and return response
     * @param date
     * @param mission
     * @param camera
     * @returns {Promise<unknown>}
     */
    const read_form = async(date, mission, camera) => {
        if(validForm(date, mission, camera)){
            const list_photos = await connection_nasa.getPhotos(date.value,
                                                            mission.value.toLowerCase(),
                                                            camera.value.toLowerCase());
            return Promise.resolve(list_photos.data);
        }
        return Promise.reject();
    }
    /**
     * this function clear error of form
     * @param dateInput
     * @param mission
     * @param camera
     */
    const clear_form = (dateInput, mission, camera) => {
        validatorModule.displayError(dateInput, {isValid: true, message: ''});
        validatorModule.displayError(mission, {isValid: true, message: ''});
        validatorModule.displayError(camera, {isValid: true, message: ''});
    }

    const deleteAll = async(e) => {
        modal_confirm_all.hide();
        const modal_success = document.getElementById("modal_save");
        const modal = new bootstrap.Modal(modal_success, {});
        const url = `/api/deleteAllPictures`;

        if(list_images_selected.children.length){
            await connection_user.deleteAllPicture(url)
                    .then( (res) => {
                        modal_success.querySelector(".modal-body").innerHTML = res.message;
                        modal.show();
                        list_images_selected.innerHTML = '';
                        list_save.clear();
                    })
                    .catch( (err) => {
                        if(err.redirect){
                            error_server(err);
                            window.location.pathname = err.redirect;
                        }
                        error_server(err);
                    });
        }else{
            modal_success.querySelector(".modal-body").innerHTML = 'There are no pictures to delete.';
            modal.show();
        }
    }
    /**
     * this function clear carousel area
     */
     const clear_carousel = () => {
        carousel_indicators.innerHTML = "";
        carousel_items.innerHTML = "";
    }
    /**
     * this function display carousel
     */
    const display_carousel = () => {
        clear_carousel();
        carousel_indicators.appendChild(list_save.generateButtonsSlide());
        carousel_items.appendChild(list_save.generateCarouselItems());
    }

    const toogleListSave = () => {
        document.getElementById("clearList").hidden = toogleFlag;
        for(let i = 0; i < list_images_selected.children.length; i++){
            const saved_item = list_images_selected.children[i];
            displayButtonDelete(saved_item);
        }
    }

    const deletePicture = async(e) => {
        modal_confirm.hide();
        const element = list_images_selected.querySelector(`[id="${e.target.id}"]`);
        const url = `/api/deletePicture/${e.target.id}`;
        await connection_user.deletePicture(url)
                .then( (res) => {
                    const modal_success = document.getElementById("modal_save");
                    const modal = new bootstrap.Modal(modal_success, {});
                    modal_success.querySelector(".modal-body").innerHTML = res.message;
                    modal.show();
                    list_save.deleteItem(e.target.id);
                    element.remove();
                })
                .catch( (err) => {
                    if(err.redirect){
                        error_server(err);
                        window.location.pathname = err.redirect;
                    }
                    error_server(err);
                });
    }

    const removeFromList = (e) => {
        e.preventDefault();
        const li_node = e.target;
        const modal = document.getElementById('confirm-modal');
        modal.querySelector(".modal-body").innerHTML = `Are you sure you want to delete this image: ${li_node.id}?`;
        modal_confirm.show();
        const btn_confirm = modal.querySelector('.btn-danger');
        btn_confirm.setAttribute('id', li_node.id);
        btn_confirm.addEventListener('click', deletePicture);
    }

    const savedImage = async(e) => {
        e.preventDefault();
        const element = e.target;
        const photo = rovers_list.getItem(element.id);
        const url = `/api/savePicture`;
        await connection_user.save_picture(url, photo)
                .then( () => {
                    list_save.add(photo);
                    const photo_li = photo.toHtmlUl();
                    photo_li.addEventListener('submit', removeFromList);
                    
                    displayButtonDelete(photo_li);
                    list_images_selected.appendChild(photo_li);
                })
                .catch( (error) => {
                    if(error.redirect){
                        window.location.pathname = error.redirect;
                    }else{
                        const modal = document.getElementById("modal_save");
                        modal.querySelector(".modal-body").innerHTML = error.message;
                        let myModal = new bootstrap.Modal(modal, {});
                        myModal.show();
                    }
                })
    }

    const attachListenersSave = () => {
        for(let i = 0; i < document.getElementById('rovers_photos').children.length; i++){
            const element = document.getElementById('rovers_photos').children[i];
            element.addEventListener('submit', savedImage);
        }
    }
    
    const sanitizeResponsePhotos = (list_photos) => {
        let photos = [];
        for(let photo_nasa of list_photos){
            let element = new images.Images(photo_nasa.id,
                photo_nasa.earth_date,
                photo_nasa.camera.name,
                photo_nasa.img_src,
                photo_nasa.sol,
                photo_nasa.rover.name);

            photos.push(element);
        }
        return photos;
    }


    document.addEventListener('DOMContentLoaded', function () {
        let form = document.querySelector(".needs-validation");
        let reset = document.getElementById('clear_form');
        let start_slide = document.getElementById('start_slide');
        let stop_slide = document.getElementById('stop_slide');
        let editList = document.getElementById('edit');
        let endEditList = document.getElementById('end-edit');
        let clearList = document.getElementById('options-list');

        modal_confirm = new bootstrap.Modal(document.getElementById('confirm-modal'), {});
        modal_confirm_all = new bootstrap.Modal(document.getElementById('confirm-modal-all'), {});
        body_search = document.getElementById("search");
        carousel_indicators = document.getElementById('indicators');
        carousel_items = document.getElementById('carousel-items');
        place_rover = document.getElementById('rovers_photos');
        modal_gif = document.getElementById("loading");
        list_images_selected = document.getElementById('images_selected');

        /**
         * if first connection fail we show message
         * else we can continue to read form or another events
         */
         getMissions()
         .then( () => {
            getPicturesSaves();

            form.addEventListener('submit', function (event) {
                event.preventDefault();
                modal_gif.style.display = 'block';
                setTimeout(() => {
                    read_form(this.elements.dateInput, this.elements.mission, this.elements.camera)
                        .then( response => {
                            modal_gif.style.display = 'none';
                            display_photos_cards(response);
                        })
                        .catch((err) => {
                            modal_gif.style.display = 'none'
                            if(err !== undefined)
                                error_server(err);
                        });
                    }, 50);
             });

            reset.addEventListener('click', () => {
                form.reset();
                clear_form(form.elements.dateInput, form.elements.mission, form.elements.camera);
                place_rover.innerHTML = "";
            });

            editList.addEventListener('click', function(event){
                event.preventDefault();
                editList.classList.add('d-none');
                endEditList.hidden = false;
                toogleFlag = false;
                toogleListSave();
            });

            endEditList.addEventListener('click', function(event){
                editList.classList.remove('d-none');
                endEditList.hidden = true;
                toogleFlag = true;
                toogleListSave();
            })

            clearList.addEventListener('submit', function(event){
                event.preventDefault();

                modal_confirm_all.show();
                document.getElementById('accept-btn-all').addEventListener('click', deleteAll);
            });

            start_slide.addEventListener('click', display_carousel);

            stop_slide.addEventListener('click', clear_carousel);
             
         })
         .catch( err => {
             error_server(err);
         })
    });
})();