var ListSettingProperties = [{ name: "checkout_ok" }, { name: "not_found_class" }, { name: "not_checkin_yet" }, { name: "not_checkout" }, { name: "not_existed" }, { name: "not_member" }, { name: "checkin_ok" }]
var dateTime = require('node-datetime');
const { Op } = require("sequelize");
const MAX_STACK = 50
var STACK = []
var TelegramBot = require('node-telegram-bot-api');
const TimeOut = 3600;
var BOT;
const GroupMembers = require('../models').GroupMembers;
const Classes = require('../models').Classes;
const Users = require('../models').Users;
const Histories = require('../models').Histories;
const Settings = require('../models').Settings;
const UsersService = require('../services/users');
const SettingsService = require('../services/settings');

function standardizedReplyMessage(reply, obj) {
    reply = reply.replaceAll("@username", "@" + obj.username)
    for (const [key, val] of Object.entries(obj)) {
        reply = reply.replaceAll("@" + key, val)
    }
    return reply
}
// VAO LOP1 DAY 101
async function init_bot() {
    const bot_token = await Settings.findOne({ where: { name: "bot_token" } });
    if (bot_token == null) {
        return false;
    }
    BOT = new TelegramBot(bot_token.value, { polling: true });
    BOT.onText(/\/VAO*/, async function(msg, match) {
        var settings = await SettingsService.getSettingByNames(ListSettingProperties)
        var chatId = msg.chat.id;
        // VALIDATE INPUT : Ex: VAO LOP1 DAY 101
        let message = msg.text;
        message = "VAO LOP1 DAY 101"
        let pars = message.split(" ");
        let class_name = pars[1];
        let action = pars[2];
        let room = pars[3];
        let description = pars[4];
        let reply = "";
        if (class_name == "-help") {
            reply = settings.checkin_content;
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, {}))
        }
        if (class_name == undefined || action == undefined) {
            reply = settings.missing_params;
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, {}) + " mã lớp hoặc hành động")
        }
        if (action == "DV" && description == undefined) {
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, {}) + " mô tả dịch vụ")
        }
        let user_id = msg.from.id;
        let username = msg.from.username;
        // Check user existed
        let dbUser = await Users.findOne({
            where: { tele_id: user_id, is_lead: 0, is_delete: 0 },
            someAttribute: {

            }
        });
        if (dbUser == null || !dbUser) {
            reply = settings.not_existed;
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, { user_id: user_id, username: username }))
        }
        // Check in groups
        let dbUserid = dbUser.id;
        let dbGroup = await GroupMembers.findOne({
            where: { member_id: dbUserid }
        });
        if (dbGroup == null) {
            reply = settings.not_member;
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, { user_id: user_id, username: username }))
        }
        // Check class
        let classes = await Classes.findOne({
            where: {
                class_code: class_name
            }
        });
        if (classes == null) {
            reply = settings.not_found_class;
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, {}))
        }
        let class_id = classes.id
            // Check have checked in
        let history = await Histories.findOne({
            where: {
                user_id: user_id,
                checkout: null
            }
        });
        if (history != null) {
            reply = settings.not_checkout;
            let last_checkin = dateTime.create(history.checkin).format('Y-m-d H:M:S');
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, { checkin: last_checkin }))
        }
        // Checkin
        var today = dateTime.create();
        var today_formatted = today.format('Y-m-d H:M:S');
        if (room == undefined) { room = "" }
        let checkin_history = await Histories.create({ action: action, description: description, class_id: class_id, user_id: dbUserid, checkin: today_formatted, room: room });
        if (checkin_history) {
            reply = settings.checkin_ok;
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, { room: room, checkin: dateTime.create(checkin_history.checkin).format('Y-m-d H:M:S'), class_name: class_name, action, action, user_id: dbUserid, username, username, full_name: dbUser.full_name, id: checkin_history.id }))
        }
    });
    BOT.onText(/\/RA*/, async function(msg, match) {
        var settings = await SettingsService.getSettingByNames(ListSettingProperties)
        var chatId = msg.chat.id;
        // VALIDATE INPUT : Ex: VAO LOP1 DAY 101
        let message = msg.text;
        message = "RA LOP1 DAY 101"
        let pars = message.split(" ");
        let class_name = pars[1];
        let action = pars[2];
        let room = pars[3];
        let reply = "";
        if (class_name == "-help") {
            reply = settings.checkout_content;
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, {}))
        }
        if (class_name == undefined) {
            return
        }
        let user_id = msg.from.id;
        let username = msg.from.username;
        // Check user existed
        let dbUser = await Users.findOne({
            where: { tele_id: user_id, is_lead: 0, is_delete: 0 },
            someAttribute: {

            }
        });
        if (dbUser == null || !dbUser) {
            reply = settings.not_existed;
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, { user_id: user_id, username: username }))
        }
        // Check in groups
        let dbUserid = dbUser.id;
        let dbGroup = await GroupMembers.findOne({
            where: { member_id: dbUserid }
        });
        if (dbGroup == null) {
            reply = settings.not_member;
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, { user_id: user_id, username: username }))
        }
        // Check class
        let classes = await Classes.findOne({
            where: {
                class_code: class_name
            }
        });
        if (classes == null) {
            reply = settings.not_found_class;
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, {}))
        }
        let class_id = classes.id
            // Check have checked in
        let history = await Histories.findOne({
            where: {
                class_id: class_id,
                user_id: dbUserid,
                checkout: null,
                action: action
            }
        });
        if (history == null) {
            reply = settings.not_checkin_yet;
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, {}))
        }
        // Checkin
        var checkout_date = dateTime.create();
        var checkout_date_formatted = checkout_date.format('Y-m-d H:M:S');
        // Calculate time keep class
        let time_keep = (new Date(checkout_date_formatted) - new Date(history.checkin)) / 1000;
        if (time_keep <= 10 * 60) {
            time_keep = 0;
        }
        let currency = 0;
        if (action == 'DAY') { currency = classes.min_price }
        if (action == 'THI') { currency = classes.term_price }
        if (action == 'DV') { currency = classes.other_price }
        // 
        let salary = time_keep * (currency / 3600);
        let checkout_history = await Histories.update({ salary: salary, checkout: checkout_date_formatted, time_keep: time_keep, checkout: checkout_date_formatted }, {
            where: {
                id: history.id
            }
        });
        if (checkout_history) {
            reply = settings.checkout_ok;
            // Hệ thống đã ghi nhận GV @full_name Kết thúc  @action tại lớp @class_name Phòng @room. Thời gian là @checkout. Tổng thời gian làm việc lần này là: [@time_keep] Bạn sẽ nhận được [@salary]
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, { time_keep: (time_keep / 60).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "phút", action, action, class_name: class_name, salary: (salary).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "đ", room: room, username, checkout: checkout_date_formatted, full_name: dbUser.full_name, id: checkout_history.id }))
        }
    });

}

module.exports = {
    init_bot,
    BOT
}