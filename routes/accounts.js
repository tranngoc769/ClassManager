var express = require('express');
var router = express.Router();
const Accounts = require('../models').Accounts;

const Groups = require('../models').Groups;
const GroupsService = require('../services/groups')
const Users = require('../models').Users;
const GroupMembers = require('../models').GroupMembers;
var moment = require('moment');
const Util = require('../internal/util');
const util = require('../internal/util');

/* GET groups listing. */
router.get('/', async function(req, res, next) {
    let accounts = await Accounts.findAll({
        where: {
            is_delete: 0
        }
    });
    let render_data = {
        accounts: accounts,
        moment: moment,
        title: "Danh sách tài khoản"
    }
    res.render("accounts/accounts", render_data)
});
router.post('/active', async function(req, res, next) {
    var json = JSON.stringify(req.body);
    try {
        json = JSON.parse(json);
    } catch (error) {}
    const updated = await Accounts.update({
        is_delete: json.is_delete
    }, {
        where: { id: json.id }
    })
    if (updated) {
        return res.send({ "code": 200, "msg": "Thành công" })
    }
    return res.send({ "code": 400, "msg": "Đã tồn tại" })
});
router.get('/add', async function(req, res, next) {
    // let users = await Accounts.findAll({
    //     attributes: ['id', 'role', 'username', 'password', 'genre', 'dob', 'createdAt', 'updatedAt', 'is_delete']
    // });
    let render_data = {
        title: "Thêm thành viên"
    }
    res.render("accounts/add", render_data)
});

router.post('/add', async function(req, res, next) {
    var json = JSON.stringify(req.body);
    try {
        json = JSON.parse(json);
    } catch (error) {}
    const [validate, error] = Util.validated_parameter(["group_code", "group_name", "leader"], json)
    if (!validate) {
        return res.send({ "code": 400, "msg": error });
    }
    const [groups, created] = await Groups.findOrCreate({
        where: { group_code: json.group_code },
        defaults: {
            group_code: json.group_code,
            group_name: json.group_name,
            leader: json.leader,
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
    const [validate, error] = Util.validated_parameter(["group_code", "group_name", "leader", "id"], json)
    if (!validate) {
        return res.send({ "code": 400, "msg": error });
    }
    const updated = await Groups.update({
        group_code: json.group_code,
        group_name: json.group_name,
        leader: json.leader
    }, {
        where: { id: json.id }
    })
    if (updated) {
        return res.send({ "code": 200, "msg": "Thành công" })
    }
    return res.send({ "code": 400, "msg": "Không thành công" })
});
module.exports = router;