var express = require('express');
var router = express.Router();
const Groups = require('../models').Groups;
const GroupsService = require('../services/groups')
const Users = require('../models').Users;
var moment = require('moment');
const Util = require('../internal/util')

/* GET groups listing. */
router.get('/', async function(req, res, next) {
    let groups = await GroupsService.getAllGroups();
    let render_data = {
        groups: groups,
        moment: moment,
        title: "Danh sách nhóm"
    }
    res.render("group/groups", render_data)
});
router.get('/add', async function(req, res, next) {
    let users = await Users.findAll({
        attributes: ['id', 'full_name', 'phone']
    });
    let render_data = {
        title: "Thêm nhóm",
        users: users
    }
    res.render("group/add_group", render_data)
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
router.get('/edit/:groupid', async(req, res) => {
    const groupid = +req.params.groupid;
    let groups = await Groups.findOne({ where: { id: groupid } });
    if (groups == null) {
        return res.send("invalid groupid");
    }
    let users = await Users.findAll({
        attributes: ['id', 'full_name', 'phone']
    });
    let render_data = {
        title: "Chỉnh sửa nhóm",
        group: groups,
        users: users

    }
    res.render("group/edit_group", render_data)
});


module.exports = router;