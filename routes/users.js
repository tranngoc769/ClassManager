var express = require('express');
var router = express.Router();
const Users = require('../models').Users;
var moment = require('moment');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    let users = await Users.findAll();
    let render_data = {
        users: users,
        moment: moment,
        title: "Danh sách người dùng"
    }
    res.render("users", render_data)
});
router.get('/', function(req, res, next) {
    res.render("users")
});
module.exports = router;