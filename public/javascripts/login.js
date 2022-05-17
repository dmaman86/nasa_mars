'use strict';

import { connection_user } from './services_connection.js';
import { validatorUser, validatorModule } from './services_validator.js';

(function() {
    /**
     * this function validate all field form
     * @param email
     * @param password
     * @returns {*}
     */
    const validateForm = (email, password) => {
        email.value = email.value.trim().toLowerCase();
        password.value = password.value.trim();

        let v1 = validatorModule.validateField(email, validatorUser.validNotEmpty,
                                                        validatorUser.validEmailPattern);
        let v2 = validatorModule.validateField(password, validatorUser.validNotEmpty,
                                                        validatorUser.validLengthPassword);

        return v1 && v2;
    }

    document.addEventListener('DOMContentLoaded', function () {
        let form = document.getElementById('login');
        let createAccount = document.getElementById('create-account');
        let error_login = document.getElementById("error-login");

        form.addEventListener('submit', function(event){
            event.preventDefault();
            if(validateForm(this.elements.InputEmail, this.elements.InputPassword)){
                let email = this.elements.InputEmail.value.trim().toLowerCase();
                let password = this.elements.InputPassword.value.trim();
                const url = `/api/login`;
                connection_user.login_user(url, email, password)
                    .then( (res) => {
                        window.location.pathname = res.redirect;
                    })
                    .catch( (err) => {
                        error_login.hidden = false;
                        error_login.innerHTML = err.message;
                    })
            }
        });

        createAccount.addEventListener('click', function(event){
            event.preventDefault();
            window.location.pathname = "/register";
        });
    });
})();