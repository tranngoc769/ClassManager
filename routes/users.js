var express = require('express');
var router = express.Router();
const Users = require('../models').Users;
var moment = require('moment');
const Util = require('../internal/util')

/* GET users listing. */
router.get('/', async function(req, res, next) {
    let users = await Users.findAll();
    let render_data = {
        users: users,
        moment: moment,
        title: "Danh sách người dùng"
    }
    res.render("user/users", render_data)
});
router.get('/add', function(req, res, next) {
    let render_data = {
        title: "Thêm người dùng"
    }
    res.render("user/add_user", render_data)
});

router.post('/add', async function(req, res, next) {
    var json = JSON.stringify(req.body);
    try {
        json = JSON.parse(json);
    } catch (error) {}
    const [validate, error] = Util.validated_parameter(["tele_id", "tele_user", "is_lead", "full_name"], json)
    if (!validate) {
        return res.send({ "code": 400, "msg": error });
    }
    const [user, created] = await Users.findOrCreate({
        where: { tele_id: json.tele_id },
        defaults: {
            tele_id: json.tele_id,
            tele_user: json.tele_user,
            is_lead: json.is_lead,
            full_name: json.full_name,
            phone: json.phone,
            social: json.social,
            address: json.address
        }
    })
    if (created) {
        return res.send({ "code": 200, "msg": "Thành công" })
    }
    return res.send({ "code": 400, "msg": "Đã tồn tại" })
});
module.exports = router;