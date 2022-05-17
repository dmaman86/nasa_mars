const Cookies = require('cookies');

function isNotAuth(req, res, next){
    if(!req.session.user_login){
        next();
    }else{
        res.status(301).redirect('/home');
    }
}

function isAuth(req, res, next){
    if(req.session.user && req.session.user_login){
        next();
    }else{
        res.status(301).redirect('/login');
    }
}

function isNotAuthRegister(req, res, next){
    if(req.session.user && !req.session.user_login){
        next();
    }else{
        if(!req.session.user && !req.session.user_login){
            res.status(301).redirect('/register');
        }
        else{
            res.status(301).redirect('/home');
        }
    }
}

function isNotAuthFetch(req, res, next){
    if(req.session.user){
        next();
    }else{
        res.status(401).send({ message: 'Unauthorized', redirect: '/login' });
    }
}

function isLooged(req, res, next){
    if(req.session.user_login){
        res.status(301).redirect('/home');
    }else{
        res.status(301).redirect('/login');
    }
}

const validRegistrationTime = (req, res, next) => {
    const cookies = new Cookies(req, res);
    const my_cookie = cookies.get('register');
    if(!my_cookie){
        res.status(301).redirect('/register');
    }else{
        next();
    }
}

const currentUser = (req, res, next) => {
    if(req.session.user){
        res.locals.user = req.session.user;
        next();
    }else{
        res.locals.user = null;
        next();
    }
}

module.exports = {
    isLooged,
    isNotAuthFetch,
    isNotAuth,
    isAuth,
    isNotAuthRegister,
    validRegistrationTime,
    currentUser
}