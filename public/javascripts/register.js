'use strict';

import { connection_user } from './services_connection.js';
import { validatorUser, validatorModule } from './services_validator.js';

class User{
    constructor(fname, lname, email, password = ''){
        this.fname = fname;
        this.lname = lname;
        this.email = email.toLowerCase();
        this.password = password;
    }
}

(function() {
    /**
     * this function validate all field form
     * @param fname
     * @param lname
     * @param email
     * @returns {*}
     */
    const validateForm = (fname, lname, email) => {
        fname.value = fname.value.trim();
        lname.value = lname.value.trim();
        email.value = email.value.trim();

        let v1 = validatorModule.validateField(fname, validatorUser.validNotEmpty,
                                                        validatorUser.hasOnlyLetters);
        let v2 = validatorModule.validateField(lname, validatorUser.validNotEmpty,
                                                        validatorUser.hasOnlyLetters);
        let v3 = validatorModule.validateField(email, validatorUser.validNotEmpty,
                                                        validatorUser.validEmailPattern);

        return v1 && v2 && v3;
    }

    document.addEventListener('DOMContentLoaded', function () {
        let form = document.getElementById('register');
        let logIn = document.getElementById("log-in");
        
        form.addEventListener('submit', function(event){
            event.preventDefault();
            if(validateForm(this.elements.inputFName, this.elements.inputLName, this.elements.InputEmail)){
                let fname = this.elements.inputFName.value.trim();
                let lname = this.elements.inputLName.value.trim();
                let email = this.elements.InputEmail.value.trim();
                let user = new User(fname, lname, email);
                const url = `/api/validUserInfo`;
                connection_user.findUser(url, user)
                    .then( (res) => {
                        window.location.pathname = res.redirect;
                    })
                    .catch( err => {
                        validatorModule.displayError(this.elements.InputEmail,
                                                { isValid: false, message: err.message });
                    })
            }
        });

        logIn.addEventListener('click', function(event){
            event.preventDefault();
            window.location.pathname = "/login";
        });
    });
})();