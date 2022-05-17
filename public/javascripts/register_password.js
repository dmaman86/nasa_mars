'use strict';

import { connection_user } from './services_connection.js';
import { validatorUser, validatorModule } from './services_validator.js';

(function() {
    /**
     * this function validate all field form
     * @param password1
     * @param password2
     * @returns {boolean|*}
     */
    const validateForm = (password1, password2) => {
        password1.value = password1.value.trim();
        password2.value = password2.value.trim();

        let v1 = validatorModule.validateField(password1, validatorUser.validNotEmpty,
                                                    validatorUser.validLengthPassword);
        let v2 = validatorModule.validateField(password2, validatorUser.validNotEmpty,
                                                    validatorUser.validLengthPassword)
        let v = v1 && v2;
        if( v ){
            return validatorModule.validateEqualInput(password1, password2,
                                                        validatorUser.validISEqual);
        }
        return v;
    }

    const redirect = (url) => {
        setTimeout( () => {
            window.location.pathname = url;
        }, 1500);
    }

    document.addEventListener('DOMContentLoaded', function () {
        let form = document.getElementById('register');
        let success = document.getElementById("success");

        success.classList.add('d-none');

        form.addEventListener('submit', function(event){
            event.preventDefault();
            let password1 = this.elements.inputPassword1;
            let password2 = this.elements.inputPassword2;
            
            if(validateForm(password1, password2)){
                const url = `/api/saveUser`;
                connection_user.save_user(url, password1.value.trim())
                    .then( (res) => {
                        redirect(res.redirect);
                        success.classList.remove('d-none');
                        success.innerHTML = res.message;
                    })
                    .catch( err => {
                        if(err.message){
                            redirect('/register');
                            success.classList.remove('d-none');
                            success.innerHTML = err.message;
                        }else{
                            window.location.pathname = "/register";
                        }
                    });
            }
        });
    });
})();