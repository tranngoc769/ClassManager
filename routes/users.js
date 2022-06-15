var express = require('express');
var router = express.Router();
const Users = require('../models').Users;
var moment = require('moment');
const Util = require('../internal/util')

/* GET users listing. */
router.get('/', async function(req, res, next) {
    let users = await Users.findAll({
        where: {
            is_delete: 0
        }
    });
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
            dv_salary: json.dv_salary,
            thi_salary: json.thi_salary,
            day_salary: json.day_salary,
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
router.post('/update', async function(req, res, next) {
    var json = JSON.stringify(req.body);
    try {
        json = JSON.parse(json);
    } catch (error) {}
    const [validate, error] = Util.validated_parameter(["tele_id", "tele_user", "is_lead", "id", "full_name"], json)
    if (!validate) {
        return res.send({ "code": 400, "msg": error });
    }
    const updated = await Users.update({
        tele_id: json.tele_id,
        tele_user: json.tele_user,
        is_lead: json.is_lead,
        full_name: json.full_name,
        phone: json.phone,
        dv_salary: json.dv_salary,
        thi_salary: json.thi_salary,
        day_salary: json.day_salary,
        social: json.social,
        address: json.address
    }, {
        where: { id: json.id }
    })
    if (updated) {
        return res.send({ "code": 200, "msg": "Thành công" })
    }
    return res.send({ "code": 400, "msg": "Không thành công" })
});
router.get('/edit/:userid', async(req, res) => {
    const userid = +req.params.userid;
    let user = await Users.findOne({ where: { id: userid, is_delete: 0 } });
    if (user == null) {
        return res.send("invalid userid");
    }
    let render_data = {
        title: "Chỉnh sửa người dùng",
        user: user
    }
    res.render("user/edit_user", render_data)
});


module.exports = router;