'use strict';
const Settings = require('../models').Settings;
const { Op } = require("sequelize");
async function getSettingByNames(arr = [{ name: "dangky_content" }, { name: "dangky_content" }]) {
    var settings = await Settings.findAll({
        where: {
            [Op.or]: arr
        }
    });
    var setting_data = {}
    settings.every(setting => {
        setting_data[setting.name] = setting.value
    })
    return setting_data;
}
module.exports = {
    getSettingByNames,
};