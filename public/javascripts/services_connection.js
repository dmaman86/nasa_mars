import { validatorSearching } from './services_validator.js';

/**
 * @param response
 * @returns {Promise<never>|Promise<unknown>}
 */
const status = (response) => {
    if (response.status >= 200 && response.status < 300)
        return Promise.resolve(response);
    else
        return Promise.reject(response);
}

const connection_user = ( function(){
    let public_data = {};

    public_data.findUser = async(url, user) => {
        const body = body_to_send(user, 'POST');
        return await connection_fetch(url, body)
                .then( result => {
                    return Promise.resolve(result)
                })
                .catch( err => Promise.reject(err) );
    }

    public_data.save_user = async(url, password) => {
        const body = body_to_send({password: password}, 'POST');
        
        return await connection_fetch(url, body)
                .then( result => Promise.resolve(result))
                .catch( err => Promise.reject(err) );
    }

    public_data.login_user = async(url, email, password) => {
        const body = body_to_send({email: email, password: password}, 'POST');
        return await connection_fetch(url, body)
                    .then( result => Promise.resolve(result) )
                    .catch( err => Promise.reject(err) );
    }

    public_data.save_picture = async(url, picture) => {
        const body = body_to_send(picture, 'POST');
        return await connection_fetch(url, body)
            .then( result => Promise.resolve(result) )
            .catch( err => Promise.reject(err) );
    }

    public_data.getAllPictures = async(url) => {

        return await connection_fetch(url)
            .then( result => Promise.resolve(result) )
            .catch( err => Promise.reject(err) );
    }

    public_data.deletePicture = async(url) => {
        const body = body_to_send(null, 'DELETE');
        return await connection_fetch(url, body)
            .then( result => Promise.resolve(result) )
            .catch( err => Promise.reject(err) );
    }

    public_data.deleteAllPicture = async(url) => {
        const body = body_to_send(null, 'DELETE');
        return await connection_fetch(url, body)
            .then( result => Promise.resolve(result) )
            .catch( err => Promise.reject(err) );
    }

    const body_to_send = (info, method) => {
        return {
            method: method,
            headers: { "Content-Type": "application/json",
                         'Accept': 'application/json' },
            body: (info !== null ) ? JSON.stringify(info) : null
        }
    }

    const connection_fetch = async (url, body) => {
        return await fetch(url, body)
                .then(status)
                .then( res => res.json() )
                .then( json => Promise.resolve(json) )
                .catch( async err => {
                    err = await err.json();
                    return Promise.reject(err) 
                });
    }

    return public_data;
})();

/**
 * charge to the connections to the site.
 * @type {{}}
 */
 const connection_nasa = ( function (){
    const APIKEY = 'fYn4I8SZpRT8bUc0oIJ6xsw27aZqvK4QzwzeyMZw';
    const URL_NASA = 'https://api.nasa.gov/mars-photos/api/v1';

    let public_connection = {};

    /**
     * this function is to get values about mission to validate
     * @param mission_name
     * @returns {Promise<{data: any}>}
     */
    public_connection.initMission = async(mission_name) => {
        const url = `${URL_NASA}/manifests/${mission_name}?api_key=${APIKEY}`;
        return await connection_fetch(url)
                .then( result => Promise.resolve({data: result.data.photo_manifest}))
                .catch( err => Promise.reject(err) );
    }
    /**
     * this function return photos about some mission
     * @param date
     * @param mission
     * @param camera
     * @returns {Promise<{data: any}>}
     */
    public_connection.getPhotos = async(date, mission, camera) => {
        const format = validatorSearching.isValidDate(date) ? 'earth_date' : 'sol';
        const url = `${URL_NASA}/rovers/${mission}/photos?${format}=${date}&camera=${camera}&api_key=${APIKEY}`;
        return await connection_fetch(url)
                .then( result => Promise.resolve({data: result.data.photos}) )
                .catch( err => Promise.reject(err) );
    }
    /**
     * private function, this function get response server nasa
     * @param url
     * @returns {Promise<{data: any}>}
     */
    const connection_fetch = async(url) => {
        return await fetch(url)
            .then(status)
            .then(res => res.json())
            .then(json => {
                return Promise.resolve({data: json});
            })
            .catch(err => {
                return Promise.reject({data: err});
            });
    }

    return public_connection;
})();
/**
 * charge on the missions DS
 * @type {{}}
 */
const missions_nasa = ( () => {
    let public_data = {};

    public_data.Missions = class {
        constructor() {
            this.list = [];
        }
        /**
         * insert some mission into data struct
         * @param mission
         */
        add(mission){
            const element = new Mission(mission.name, mission.landing_date, mission.max_date, mission.max_sol)
            this.list.push(element);
        }
        /**
         * this function validated input from with data struct values
         * @param mission_name
         * @param date
         * @returns {{isValid: boolean, message: string}}
         */
        validDateWithMission(mission_name, date){
            const element = this.list.find(mission => mission.mission_name === mission_name);

            if(!validatorSearching.isValidDate(date))
                return validatorSearching.validRangeDate(date, 0, element.max_sol);
            else{
                return validatorSearching.validRangeDate(date, element.landing_date, element.max_date);
            }
        }

    }
    /**
     * private class to create Mission
     */
    class Mission{
        constructor(name, landing_date, max_date, sol) {
            this.mission_name = name;
            this.landing_date = landing_date;
            this.max_date = max_date;
            this.max_sol = sol;
        }
    }

    return public_data;
})();

export { connection_user, connection_nasa, missions_nasa };