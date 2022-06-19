var express = require('express');
const md5 = require('md5');
var router = express.Router();
const Users = require('../models').Users;
var moment = require('moment');
const Util = require('../internal/util')
router.post('/active', async function (req, res, next) {
    var json = JSON.stringify(req.body);
    try {
        json = JSON.parse(json);
    } catch (error) { }
    const updated = await Users.update({
        is_delete: json.is_delete
    }, {
        where: { id: json.id }
    })
    if (updated) {
        return res.send({ "code": 200, "msg": "Thành công" })
    }
    return res.send({ "code": 400, "msg": "Đã tồn tại" })
});
/* GET users listing. */
router.get('/', async function (req, res, next) {
    let leader = req.session.user_id;
    let formatter = new Intl.NumberFormat('vi-VI', { maximumSignificantDigits: 3 });
    let users = await Users.findAll({
        where:{
            leader:leader
        }
    });
    let render_data = {
        users: users,
        formatter: formatter,
        moment: moment,
        title: "Danh sách người dùng"
    }
    render_data.session = req.session;
    res.render("user/users", render_data)
});
router.get('/add', function (req, res, next) {
    let render_data = {
        title: "Thêm người dùng"
    }
    render_data.session = req.session;
    res.render("user/add_user", render_data)
});

router.post('/add', async function (req, res, next) {
    try {
        var json = JSON.stringify(req.body);
        try {
            json = JSON.parse(json);
        } catch (error) { }
        const [validate, error] = Util.validated_parameter(["tele_id", "tele_user", "user_level", "full_name"], json)
        if (!validate) {
            return res.send({ "code": 400, "msg": error });
        }
        if (json.username == "") {
            json.username = "GV";
        }
        if (json.password == "") {
            json.password = "00000000";
        }
        const [user, created] = await Users.findOrCreate({
            where: { tele_id: json.tele_id },
            defaults: {
                tele_id: json.tele_id,
                tele_user: json.tele_user,
                user_level: json.user_level,
                full_name: json.full_name,
                dv_salary: json.dv_salary,
                thi_salary: json.thi_salary,
                day_salary: json.day_salary,
                phone: json.phone,
                social: json.social,
                username: json.username,
                password: md5(json.password),
                address: json.address
            }
        })
        if (created) {
            return res.send({ "code": 200, "msg": "Thành công" })
        }
        return res.send({ "code": 400, "msg": "Đã tồn tại" })

    } catch (error) {
        return res.send({ "code": 400, "msg": error.toString() })
    }
});
router.post('/update', async function (req, res, next) {
    var json = JSON.stringify(req.body);
    try {
        json = JSON.parse(json);
    } catch (error) { }
    const [validate, error] = Util.validated_parameter(["tele_id", "tele_user", "user_level", "id", "full_name"], json)
    if (!validate) {
        return res.send({ "code": 400, "msg": error });
    }
    if (json.username == "") {
        json.username = "GV";
    }
    let data = {
        tele_id: json.tele_id,
        tele_user: json.tele_user,
        user_level: json.user_level,
        full_name: json.full_name,
        phone: json.phone,
        dv_salary: json.dv_salary,
        thi_salary: json.thi_salary,
        day_salary: json.day_salary,
        ca_salary: json.ca_salary,
        username: json.username,
        social: json.social,
        address: json.address
    }
    if (json.password != "") {
        if (json.password.length < 8) {
            return res.send({ "code": 400, "msg": "Mật khẩu tối thiểu 8 kí tự" })
        }
        data.password = md5(json.password)
    }
    const updated = await Users.update(data, {
        where: { id: json.id }
    })
    if (updated) {
        return res.send({ "code": 200, "msg": "Thành công" })
    }
    return res.send({ "code": 400, "msg": "Không thành công" })
});
router.get('/edit/:userid', async (req, res) => {
    const userid = +req.params.userid;
    let user = await Users.findOne({ where: { id: userid, is_delete: 0 } });
    if (user == null) {
        return res.send("invalid userid");
    }
    let render_data = {
        title: "Chỉnh sửa người dùng",
        user: user
    }
    render_data.session = req.session;
    res.render("user/edit_user", render_data)
});
module.exports = router;