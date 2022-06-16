var express = require('express');
var router = express.Router();
const Classes = require('../models').Classes;
var moment = require('moment');
const Util = require('../internal/util')
router.post('/active', async function(req, res, next) {
    var json = JSON.stringify(req.body);
    try {
        json = JSON.parse(json);
    } catch (error) {}
    const updated = await Classes.update({
        is_delete: json.is_delete
    }, {
        where: { id: json.id }
    })
    if (updated) {
        return res.send({ "code": 200, "msg": "Thành công" })
    }
    return res.send({ "code": 400, "msg": "Đã tồn tại" })
});
/* GET classes listing. */
router.get('/', async function(req, res, next) {
    let classes = await Classes.findAll();
    let render_data = {
        classes: classes,
        moment: moment,
        title: "Danh sách lớp"
    }
    render_data.session = req.session;
    res.render("class/classes", render_data)
});
router.get('/add', function(req, res, next) {
    let render_data = {
        title: "Thêm lớp"
    }
    render_data.session = req.session;
    res.render("class/add_class", render_data)
});

router.post('/add', async function(req, res, next) {
    var json = JSON.stringify(req.body);
    try {
        json = JSON.parse(json);
    } catch (error) {}
    const [validate, error] = Util.validated_parameter(["class_code", "class_name", "address"], json)
    if (!validate) {
        return res.send({ "code": 400, "msg": error });
    }
    const [classes, created] = await Classes.findOrCreate({
        where: { class_code: json.class_code },
        defaults: {
            created_by: 1,
            class_code: json.class_code,
            class_name: json.class_name,
            address: json.address,
            min_price: json.min_price,
            term_price: json.term_price,
            debit: json.debit,
            other_price: json.other_price,
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
    const [validate, error] = Util.validated_parameter(["class_code", "class_name", "address", "id"], json)
    if (!validate) {
        return res.send({ "code": 400, "msg": error });
    }
    const updated = await Classes.update({
        created_by: 1,
        class_code: json.class_code,
        class_name: json.class_name,
        address: json.address,
        min_price: json.min_price,
        term_price: json.term_price,
        debit: json.debit,
        other_price: json.other_price,
    }, {
        where: { id: json.id }
    })
    if (updated) {
        return res.send({ "code": 200, "msg": "Thành công" })
    }
    return res.send({ "code": 400, "msg": "Không thành công" })
});
router.get('/edit/:classid', async(req, res) => {
    const classid = +req.params.classid;
    let classes = await Classes.findOne({ where: { id: classid, is_delete: 0 } });
    if (classes == null) {
        return res.send("invalid classid");
    }
    let render_data = {
        title: "Chỉnh sửa lớp",
        classes: classes
    }
    render_data.session = req.session;
    res.render("class/edit_class", render_data)
});


module.exports = router;