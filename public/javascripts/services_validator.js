/**
 * @param str
 * @returns {boolean}
 */
function isNotEmpty(str){
    return (str.length !== 0);
}

const validatorModule = ( () => {
    /**
     * this function validate some element with double function
     * @param element
     * @param funcOne
     * @param funcTwo
     * @returns {*}
     */
    const validateField = (element, funcOne, funcTwo) => {
        return validateInput(element, funcOne) && validateInput(element, funcTwo);
    }
    /**
     * this function validate some element with some function
     * @param inputElement
     * @param validateFunc
     * @returns {*}
     */
    const validateInput = (inputElement, validateFunc) => {
        let v = validateFunc(inputElement.value); // call the validation function
        return displayError(inputElement, v);
    }
    /**
     * this function validate if 2 elements are equals
     * @param inputElement1
     * @param inputElement2
     * @param validateFunc
     * @returns {*}
     */
    const validateEqualInput = (inputElement1, inputElement2, validateFunc) => {
        let v = validateFunc(inputElement1.value, inputElement2.value); // call the validation function
        return displayError(inputElement1, v) && displayError(inputElement2, v);
    }
    /**
     * this function is to validate mission or camera choose
     * @param choose
     * @param choose_str
     * @param func
     * @returns {*}
     */
    const validFieldChoose = (choose, choose_str,  func) => {
        let res = func(choose.value, choose_str);
        return displayError(choose, res);
    }
    /**
     * @param element
     * @param res
     * @returns {boolean|(() => boolean)|*}
     */
    const displayError = (element, res) => {
        let errorElement = element.nextElementSibling;
        errorElement.innerHTML = res.isValid ? '' : res.message;
        res.isValid ? element.classList.remove('is-invalid') :
            element.classList.add('is-invalid');
        return res.isValid;
    }

    return{
        validateField,
        validateEqualInput,
        displayError,
        validateInput,
        validFieldChoose
    }
})();

const validatorUser = ( function(){
    /**
     * @param str
     * @returns {{isValid: boolean, message: string}}
     */
    const validNotEmpty = (str) => {
        return{
            isValid: isNotEmpty(str),
            message: 'Please enter a non empty text'
        };
    }
    /**
     * @param str
     * @returns {{isValid: boolean, message: string}}
     */
    const hasOnlyLetters = (str) => {
        return {
            isValid: /^[a-zA-Z]+$/.test(str),
            message: 'text must contain letter only'
        }
    }
    /**
     * @param str
     * @returns {{isValid: boolean, message: string}}
     */
    const validEmailPattern = (str) => {
        return {
            isValid: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(str),
            message: 'please check your email'
        }
    }
    /**
     * @param str
     * @returns {{isValid: boolean, message: string}}
     */
    const validLengthPassword = (str) => {
        return{
            isValid: (str.length > 7),
            message: 'Please enter a password of at least 8 characters'
        };
    }
    /**
     * this function is to validate passwords
     * @param str1
     * @param str2
     * @returns {{isValid: boolean, message: string}}
     */
    const validISEqual = (str1, str2) => {
        return {
            isValid: (str1 === str2),
            message: 'passwords must be equal'
        }
    }

    return{
        validNotEmpty,
        hasOnlyLetters,
        validEmailPattern,
        validLengthPassword,
        validISEqual
    }
})();

/**
 * This module is in charge of validation
 */
 const validatorSearching = ( function () {
    /**
     * @param str- receives date in string, checks if it
     * earth date or sol and then checks if it correct
     * @returns {{isValid: boolean, message: string}}
     * -false if it incorrect and error message
     */
    const validFormatDate = (str) => {
        return{
            isValid: (isFormatDate(str)) ? isValidDate(str) : isOnlyNumbers(str),
            message: 'Please enter valid date(YYYY-MM-DD) format or sol'
        }
    }
    /**
     * @param str- date. checks if it in format
     * YYYY-MM-DD
     * @returns {boolean}
     */
    const isFormatDate = (str) => /^(\d{4})-(\d{1,2})-(\d{1,2})$/.test(str);
    /**
     * @param str mars date
     * @returns {boolean}
     */
    const isOnlyNumbers = (str) => /^[0-9]+$/.test(str);
    /**
     * this function validate date input
     * @param str
     * @returns {boolean}
     */
    const isValidDate = (str) => {
        const matches = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(str);
        if(matches == null) return false;
        let y = matches[1];
        let m = matches[2] - 1;
        let d = matches[3];
        let composedDate = new Date(y, m, d);
        return composedDate.getDate() == d &&
                composedDate.getMonth() == m &&
                composedDate.getFullYear() == y;
    }
    /**
     * @param str - some string
     * @returns {{isValid: boolean, message: string}}
     */
    const validNotEmpty = (str) => {
        return{
            isValid: isNotEmpty(str),
            message: 'Please enter date(YYYY-MM-DD) or sol'
        };
    }
    /**
     *checks if the user choices some mission or camera
     * @param str- user choice
     * @param toAppend- some choice from list
     * @returns {{isValid: boolean, message: string}}
     */
    const validChoose = (str, toAppend) => {
        return{
            isValid: isNotEmpty(str),
            message: `Please choose some ${toAppend}`
        };
    }
    /**
     * checks if the date in our range
     * @param date
     * @param min- minimum limit
     * @param max- maxsimum limit
     * @returns {{isValid: boolean, message: string}}
     */
    const validRangeDate = (date, min, max) => {
        const isDate = isValidDate(date);
        const local_date = isDate ? new Date(date).getTime() : date,
            local_min = isDate ? new Date(min).getTime() : min,
            local_max = isDate ? new Date(max).getTime() : max;

        let valid, delimiter, v_range;

        [valid, v_range, delimiter] = (local_date < local_min) ? [false, min, 'after'] :
            (local_date > local_max) ? [false, max, 'before'] : [true, max, ''];
        return{
            isValid: valid,
            message: `Please enter a ${ isDate ? 'date': 'sol date'} ${delimiter} ${v_range}`
        }
    }

    return{
        validDateFormat: validFormatDate,
        validNotEmpty,
        validRangeDate,
        validChoose,
        isValidDate,
        isFormatDate
    }
})();

export { validatorUser, validatorSearching, validatorModule };