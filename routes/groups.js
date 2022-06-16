var express = require('express');
var router = express.Router();
const Groups = require('../models').Groups;
const GroupsService = require('../services/groups')
const Users = require('../models').Users;
const Histories = require('../models').Histories;
const GroupMembers = require('../models').GroupMembers;
var moment = require('moment');
const Util = require('../internal/util');
const util = require('../internal/util');

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
/* GET groups listing. */
router.get('/my', async function(req, res, next) {
    let leader = 24;
    let groups = await GroupsService.getGroupsByLeader(leader);
    let render_data = {
        groups: groups,
        moment: moment,
        title: "Danh sách nhóm của tôi"
    }
    res.render("group/my_groups", render_data)
});
router.get('/members/:group_id', async function(req, res, next) {
    let group_id = +req.params.group_id;
    let from = util.getValidDatetime(req.query.from, "00:00:00");
    let to = util.getValidDatetime(req.query.to, "23:59:59");
    let groups = await Groups.findOne({ where: { id: group_id, is_delete: 0 } });
    if (groups == null) {
        return res.send("invalid group_id");
    }
    let members = await GroupMembers.findAll({
        where: {
            group_id: group_id
        }
    })
    let member_arr = [];
    members.forEach(element => {
        member_arr.push(element.member_id)
    });
    let users = await GroupsService.getGroupMembers(group_id);
    let user_all = await Users.findAll({
        where: {
            is_delete: 0
        }
    });
    let render_data = {
        users: users,
        members: member_arr,
        group_id: group_id,
        groups: groups,
        users: users,
        user_all: user_all,
        from: moment(from).format("YYYY-MM-DD"),
        to: moment(to).format("YYYY-MM-DD"),
        moment: moment,
        title: "Danh sách thành viên nhóm của tôi"
    }
    res.render("group/group_membere", render_data)
});
router.get('/add-member/:group_id', async function(req, res, next) {
    let group_id = +req.params.group_id;
    let members = await GroupMembers.findAll({
        where: {
            group_id: group_id
        }
    })
    let member_arr = [];
    members.forEach(element => {
        member_arr.push(element.member_id)
    });
    let users = await Users.findAll({
        where: {
            is_delete: 0
        }
    });
    let render_data = {
        users: users,
        members: member_arr,
        group_id: group_id,
        moment: moment,
        title: "Quản lý thành viên nhóm"
    }
    res.render("group/add_members", render_data)
});
router.post('/add-members', async function(req, res, next) {
    var json = JSON.stringify(req.body);
    try {
        json = JSON.parse(json);
    } catch (error) {}
    const [validate, error] = Util.validated_parameter(["id"], json)
    if (!validate) {
        return res.send({ "code": 400, "msg": error });
    }
    let group_id = json.id;
    await GroupMembers.destroy({
        where: {
            group_id: group_id
        }
    });
    let members = json.members;
    let insert_members = [];
    members.forEach(element => {
        insert_members.push({ group_id: group_id, member_id: element * 1 })
    });
    let created = await GroupMembers.bulkCreate(insert_members);
    if (created) {
        return res.send({ "code": 200, "msg": "Thành công" })
    }
    return res.send({ "code": 400, "msg": "Không thành công" })
});
router.get('/add', async function(req, res, next) {
    let users = await Users.findAll({
        where: {
            is_delete: 0
        },
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

router.post('/active', async function(req, res, next) {
    var json = JSON.stringify(req.body);
    try {
        json = JSON.parse(json);
    } catch (error) {}
    const updated = await Groups.update({
        is_delete: json.is_delete
    }, {
        where: { id: json.id }
    })
    if (updated) {
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
router.get('/edit/:group_id', async(req, res) => {
    const group_id = +req.params.group_id;
    let groups = await Groups.findOne({ where: { id: group_id, is_delete: 0 } });
    if (groups == null) {
        return res.send("invalid group_id");
    }
    let users = await Users.findAll({
        where: {
            is_delete: 0
        },
        attributes: ['id', 'full_name', 'phone']
    });
    let render_data = {
        title: "Chỉnh sửa nhóm",
        group: groups,
        users: users

    }
    res.render("group/edit_group", render_data)
});
router.get('/salary/:group_id', async(req, res) => {
    const group_id = +req.params.group_id;
    const user_id = +req.query.user_id;
    let from = util.getValidDatetime(req.query.from, "00:00:00");
    let to = util.getValidDatetime(req.query.to, "23:59:59");
    let groups = await Groups.findOne({ where: { id: group_id, is_delete: 0 } });
    if (groups == null) {
        return res.send("invalid group_id");
    }
    let salaries = await GroupsService.getSummarySalary(groups.id, from, to, user_id);
    let turn_overs = 0;
    let paid = 0;
    let debit_turn_overs = 0;
    let debit_paid = 0;
    salaries.forEach(element => {
        turn_overs += element.turn_over;
        paid += element.salary;
        if (element.is_center_paid == 0) {
            debit_turn_overs += element.turn_over;
        }
        if (element.is_user_paid == 0) {
            debit_paid += element.salary;
        }
    });
    let formatter = new Intl.NumberFormat('vi-VI', { maximumSignificantDigits: 3 });
    let render_data = {
        turn_overs: turn_overs,
        paid: paid,
        formatter: formatter,
        debit_turn_overs: debit_turn_overs,
        debit_paid: debit_paid,
        title: "Thống kê lương nhóm",
        moment: moment,
        salaries: salaries,
        from: moment(from).format("YYYY-MM-DD"),
        to: moment(to).format("YYYY-MM-DD"),
    }
    res.render("group/group_salary", render_data)
});
router.get('/report/:group_id', async(req, res) => {
    const group_id = +req.params.group_id;
    const user_id = +req.query.user_id;
    let from = util.getValidDatetime(req.query.from, "00:00:00");
    let to = util.getValidDatetime(req.query.to, "23:59:59");
    let groups = await Groups.findOne({ where: { id: group_id, is_delete: 0 } });
    if (groups == null) {
        return res.send("invalid group_id");
    }
    let reports = await GroupsService.getClassReport(groups.id, from, to);
    let formatter = new Intl.NumberFormat('vi-VI', { maximumSignificantDigits: 3 });
    let render_data = {
        reports: reports,
        title: "Thống kê lớp",
        moment: moment,
        formatter: formatter,
        from: moment(from).format("YYYY-MM-DD"),
        to: moment(to).format("YYYY-MM-DD"),
    }
    res.render("group/report", render_data)
});
router.get('/working/:group_id', async(req, res) => {
    const group_id = +req.params.group_id;
    let from = util.getValidDatetime(req.query.from, "00:00:00");
    let to = util.getValidDatetime(req.query.to, "23:59:59");
    from = '2022-06-15 00:00:00'
    let groups = await Groups.findOne({ where: { id: group_id, is_delete: 0 } });
    if (groups == null) {
        return res.send("invalid group_id");
    }
    let workk_members = await GroupsService.getWorkingUsers(group_id, from, to, "");
    let free_members = await GroupsService.getWorkingUsers(group_id, from, to, " not ");
    let render_data = {
        title: "Tình trạng làm việc",
        moment: moment,
        workk_members: workk_members,
        free_members: free_members,
        from: moment(from).format("YYYY-MM-DD"),
        to: moment(to).format("YYYY-MM-DD"),
    }
    res.render("group/working", render_data)
});

// return res.send({ "code": 403, "msg": "không thể xác thực" })

router.post('/paid', async function(req, res, next) {
    var json = JSON.stringify(req.body);
    try {
        json = JSON.parse(json);
    } catch (error) {}
    const updated = await Histories.update(json, {
        where: { id: json.id }
    })
    if (updated) {
        return res.send({ "code": 200, "msg": "Thành công" })
    }
    return res.send({ "code": 400, "msg": "Không thành công" })
});
module.exports = router;