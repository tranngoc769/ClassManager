var express = require('express');
var router = express.Router();
const md5 = require("md5");
const { Op } = require('sequelize');
const Users = require('../models').Users;

function auth(req, res, next) {
    const nonSecurePaths = ['/signin', '/login'];
    if (nonSecurePaths.includes(req.path)) return next();
    if (req.session.loggedin != true && (req.session.username == "" || req.session.username == undefined) && (req.session.user_level * 1 == 0 || req.session.user_level == undefined)) {
        res.redirect('/signin');
        return
    }
    next()
}

function admin_auth(req, res, next) {
    const nonSecurePaths = ['/signin', '/login'];
    if (nonSecurePaths.includes(req.path)) return next();
    if (req.session.loggedin != true && (req.session.username == "" || req.session.username == undefined) && (req.session.user_level * 1 == 0 || req.session.user_level == undefined)) {
        return res.send({ "code": 403, "msg": "không thể xác thực" })
        return
    }
    next()
}


function asyncHandler(callbackFn) {
    return async(req, res, next) => {
        try {
            await callbackFn(req, res, next)
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    }
}


router.get('*', auth);
router.post('*', admin_auth);
// get / - Home route should redirect to the /books route
router.get('/signin', async(req, res) => {
    if (req.session.loggedin == true && (req.session.username != "" && req.session.username != undefined) && (req.session.user_level * 1 == 0 || req.session.user_level == undefined)) {
        res.redirect('/');
        return
    }
    res.render('login');
});
// get /books - Redirects to /books/pages/1
router.post('/signin', async(req, res) => {
    if (req.session.loggedin == true && (req.session.username != "" && req.session.username != undefined) && (req.session.user_level * 1 == 0 || req.session.user_level == undefined)) {
        res.redirect('/');
        return
    }
    var json = JSON.stringify(req.body);
    try {
        json = JSON.parse(json);
    } catch (error) {

    }
    let username = json.username;
    let password = json.password;
    // 
    if (username == "" || password == "" || username == undefined || password == undefined) {
        return res.send({ "code": 403, "msg": "missed username, password" })
    }
    // 
    let mdpass = md5(password);
    const user = await Users.findOne({ where: { username: username, "password": mdpass } });
    if (user === null) {
        return res.send({ "code": 403, "msg": "Không tồn tại tài khoản" })
    }
    req.session.loggedin = true;
    req.session.username = username;
    req.session.user_level = user.user_level;
    req.session.user_id = user.id;
    return res.send({ "code": 200, "msg": "Đăng nhập thành công" })

});

// post /books/:id/delete - Deletes a book
router.get('/signout', asyncHandler(async(req, res) => {
    req.session.destroy();
    res.redirect('/authen');
}));

module.exports = router;