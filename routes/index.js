var express = require('express');
var router = express.Router();
const Settings = require('../models').Settings;

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

// get / - Home route should redirect to the /books route
router.get('/', asyncHandler(async(req, res) => {
    return res.redirect('/groups');
}));
router.get('/settings', asyncHandler(async(req, res) => {
    var settings = await Settings.findAll();
    let render_data = {
        title: "Cấu hình",
        settings: settings
    }
    render_data.session = req.session;
    return res.render('settings', render_data)
}));

router.post('/settings', asyncHandler(async(req, res) => {
    var json = JSON.stringify(req.body);
    try {
        json = JSON.parse(json);
    } catch (error) {}
    await Settings.destroy({
        where: {},
        truncate: true
    })

    let created = await Settings.bulkCreate(json);
    if (created) {
        const { exec } = require("child_process");
        console.log("This is pid " + process.pid);
        setTimeout(function () {
            process.on("exit", function () {
                require("child_process").spawn(process.argv.shift(), process.argv, {
                    cwd: process.cwd(),
                    detached : true,
                    stdio: "inherit"
                });
            });
            process.exit();
        }, 1000);
        return res.send({ "code": 200, "msg": "Thành công" });
    }
    return res.send({ "code": 400, "msg": "Không thành công" })
}));

module.exports = router;