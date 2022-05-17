
const { User } = require('../models');
const Cookies = require('cookies');

/**
 * this function is to validate first register
 * @param req user first information
 * @param res
 * @returns {Promise<*>}
 */
const firstRegister = async(req, res) => {
    const { fname, lname, email } = req.body;
    const user = new LocalUser(fname, lname, email);
    try {
        // validate no exist another user with same email
        const found_user = await User.findOne({where: {email: user.email}});
        if(found_user){ // if found
            return res.status(401).send({ message: 'This email is already in use' } )
        }
        // we save a user in session to show user information in next page
        req.session.user = user;
        const cookies = new Cookies(req, res);
        cookies.set('register', new Date().toISOString(), { maxAge: 60 * 1000 });
        return res.status(200).send({ redirect: '/register/setPassword'});

    } catch (error) {
        return res.status(500).send({message: 'Internal serve error'});
    }
}
/**
 * this function is to save user in db
 * @param req user password
 * @param res
 * @returns {Promise<*>}
 */
const save_user = async(req, res) => {
    const { firstName, lastName, email } = req.session.user;
    const password = req.body.password;
    const user = new LocalUser(firstName, lastName, email, password);

    try {
        // validate no exist another user with same email
        const found_user = await User.findOne({where: {email: user.email}});
        if(found_user){ // if found
            return res.status(401).send({ message: 'This email is already in use' } )
        }else{
            // save current user information in db
            const new_user = await User.create(user);
            // delete user from session
            req.session.destroy();
            res.clearCookie('register');
            return res.status(201).send({ message: 'you are registered', redirect: '/login'})
        }
    } catch (error) {
        req.session.destroy();
        res.clearCookie('register');
        return res.status(400).send(error);
    }
}
/**
 * this function is to validate login
 * @param req email and password
 * @param res
 * @returns {Promise<*>}
 */
const login = async(req, res) => {
    // get by method post email and password
    const { email, password } = req.body;
    // if email and password not empty
    if(email && password ){
        try {
            // find user by email from db
            const user = await User.findOne( { where: { email: email } } );
            if(!user){ // if not found
                return res.status(404).send({message: 'Bad Request: User not found'});
            }else{
                // validate user password get from db with password get from post
                if(user.password === password){
                    // delete field password
                    user.password = undefined;
                    req.session.user = user;
                    req.session.user_login = true;
                    return res.status(200).send({ redirect: '/home' });
                }
                return res.status(401).send({message: 'Unauthorized: need to verify your password'});
            }
        } catch (error) {
            return res.status(500).send({message: 'Internal serve error'});
        }
    }
    return res.status(400).send({message: 'Bad request: Email or password is wrong'});
}
/* this function is when user logout */
const logOut = (req, res) => {
    if(req.session){
        req.session.destroy();
        res.status(301).redirect('/');
    }
}

const LocalUser = class{
    constructor(fname, lname, email, password = '') {
        this.firstName = fname;
        this.lastName = lname;
        this.email = email;
        this.password = password;
    }
}


module.exports = {
    firstRegister,
    save_user,
    login,
    logOut
};