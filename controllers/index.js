
/*
    this function render to register page
 */
const register = (req, res) => {
    res.render('pages/register', {  title: 'Register Page',
                                    js_path: '../javascripts/register.js',
                                    layout: 'index' });
}
/*
    this function render to register password page
 */
const register_password = (req, res) => {
    res.render('pages/register_password', { title: 'Set Password',
                                            js_path: '../javascripts/register_password.js',
                                            layout: 'index'});
}
/*
    this function render to login page
 */
const get_login = (req, res) => {
    res.render('pages/login', { title: 'Log In',
                                js_path: '../javascripts/login.js',
                                layout: 'index' })
}
/*
    this function render to home page
 */
const get_home = (req, res) => {
    res.render('pages/home', {  title: 'Home Page',
                                js_path: '../javascripts/home.js',
                                layout: 'index' })
}

const get_error = (req, res) => {
    res.render('pages/error', {  title: 'Error Page',
                                js_path: '../javascripts/error.js',
                                layout: 'index' })
}

module.exports = {
    register,
    register_password,
    get_login,
    get_home,
    get_error
};
