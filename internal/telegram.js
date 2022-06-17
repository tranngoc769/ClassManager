var ListSettingProperties = [{ name: "checkout_ok" }, { name: "not_found_class" }, { name: "not_checkin_yet" }, { name: "not_checkout" }, { name: "not_existed" }, { name: "not_member" }, { name: "checkin_ok" }, { name: "not_leader" }]
var dateTime = require('node-datetime');
const { Op } = require("sequelize");
const MAX_STACK = 50
var STACK = []
var TelegramBot = require('node-telegram-bot-api');
const TimeOut = 3600;
var BOT;
const GroupMembers = require('../models').GroupMembers;
const GroupssService = require('../services/groups')
const Groupss = require('../models').Groupss;
const Classes = require('../models').Classes;
const Users = require('../models').Users;
const Histories = require('../models').Histories;
const Settings = require('../models').Settings;
const UsersService = require('../services/users');
const Util = require('../internal/util');
const SettingsService = require('../services/settings');

function standardizedReplyMessage(reply, obj) {
    try {
        reply = reply.replaceAll("@username", "@" + obj.username)
    } catch (error) {

    }
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
    BOT.getMe().then(function(info) { console.log(`${info.first_name} is ready, the username is @${info.username}`); });
    BOT.onText(/\/VAO*/, async function(msg, match) {
        var settings = await SettingsService.getSettingByNames(ListSettingProperties)
        var chatId = msg.chat.id;
        // VALIDATE INPUT : Ex: VAO LOP1 DAY 101
        let message = msg.text.toLowerCase();
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
        // if (action == "DV" && description == undefined) {
        //     return BOT.sendMessage(chatId, standardizedReplyMessage(reply, {}) + " mô tả dịch vụ")
        // }
        let user_id = msg.from.id;
        let username = msg.from.username;
        // Check user existed
        let dbUser = await Users.findOne({
            where: { tele_id: user_id, user_level: 0, is_delete: 0 },
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
                class_code: class_name,
                is_delete: 0
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
                user_id: dbUserid,
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
        let message = msg.text.toLowerCase();
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
            where: { tele_id: user_id, user_level: 0, is_delete: 0 },
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
                class_code: class_name,
                is_delete: 0
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
        let center_currency = 0;
        let user_currency = 0;
        if (action == 'DAY') {
            if (classes.ca_price == null || classes.ca_price == 0) {
                center_currency = classes.min_price;
                user_currency = dbUser.day_salary
            } else {
                center_currency = classes.ca_price;
                user_currency = dbUser.ca_salary
            }
        }
        if (action == 'THI') {
            center_currency = classes.term_price;
            user_currency = dbUser.thi_salary
        }
        if (action == 'DV') {
            center_currency = classes.other_price;
            user_currency = dbUser.dv_salary
        }
        // 
        time_keep = time_keep;
        let minute = parseInt(time_keep / 60);
        minute = minute - (minute % 5);
        // vd : 68 , --> 68 - 3 = 65
        let user_salary = minute * (user_currency)
        let center_payment = minute * (center_currency)
        let turn_over = center_payment - user_salary;
        let checkout_history = await Histories.update({ salary: user_salary, checkout: checkout_date_formatted, time_keep: minute, checkout: checkout_date_formatted, sumary_price: center_payment, turn_over: turn_over }, {
            where: {
                id: history.id
            }
        });
        if (checkout_history) {
            reply = settings.checkout_ok;
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, { time_keep: minute + " phút", action, action, class_name: class_name, salary: (user_salary).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "đ", room: room, username, checkout: checkout_date_formatted, full_name: dbUser.full_name, id: checkout_history.id }))
        }
    });

    BOT.onText(/\/dangky*/, async function(msg, match) {
        var settings = await SettingsService.getSettingByNames(ListSettingProperties)
        var chatId = msg.chat.id;
        // VALIDATE INPUT : Ex: VAO LOP1 DAY 101
        let message = msg.text.toLowerCase();
        message = '/dangky {"full_name":"Trần văn A", "phone":"012345678","social":"link FB", "address":"34, Trần Phú"}'
        let help = `Cú pháp: /dangky {"full_name":"Họ tên", "phone":"SĐT","social":"FB", "address":"Địa chỉ"}\nVí dụ: /dangky {"full_name":"Trần văn A", "phone":"012345678","social":"link FB", "address":"34, Trần Phú"}`
        let reply = ''
        if (message.substr(8, 10) == 'help') {
            reply = help
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, {}))
        }
        let user_id = msg.from.id + "123";
        let username = msg.from.username;
        let body = message.substr(7, message.length).trim()
        try {
            body = JSON.parse(body)
            if (body.full_name == undefined || body.full_name == undefined || body.full_name == undefined || body.full_name == undefined) {
                reply = `Thiếu tham số, vui lòng kiểm tra lại dữ liệu đăng ký\n` + help;
                return BOT.sendMessage(chatId, standardizedReplyMessage(reply, {}))
            }
            // Check user existed
            const [user, created] = await Users.findOrCreate({
                where: { tele_id: user_id },
                defaults: {
                    tele_id: user_id,
                    tele_user: username,
                    user_level: 0,
                    is_delete: 1,
                    full_name: body.full_name,
                    phone: body.phone,
                    social: body.social,
                    address: body.address
                }
            })
            if (created) {
                reply = `Người dùng @${username} user_id:${user_id}  đã đăng ký thành công. Vui lòng chờ trưởng nhóm duyệt`;
                return BOT.sendMessage(chatId, standardizedReplyMessage(reply, {}))
            }
            reply = `Người dùng ${user_id} đã tồn tại. Ngày đăng ký :${dateTime.create(dbUser.createdAt).format('Y-m-d H:M:S')} `;
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, {}))
        } catch (error) {
            reply = "Cú pháp không đúng\n" + help
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, {}))
        }

    });
    BOT.onText(/\/list*/, async function(msg, match) {
        var settings = await SettingsService.getSettingByNames(ListSettingProperties)
        var chatId = msg.chat.id;
        // VALIDATE INPUT : Ex: VAO LOP1 DAY 101
        let message = msg.text.toLowerCase();
        let pars = message.split(" ");
        let action = pars[1];
        let user_id = msg.from.id;
        let username = msg.from.username;
        // Check user existed
        let dbUser = await Users.findOne({
            where: { tele_id: user_id, user_level: 0, is_delete: 0 },
            someAttribute: {}
        });
        if (dbUser == null || !dbUser) {
            reply = settings.not_existed;
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, { user_id: user_id, username: username }))
        }
        let from = Util.getValidDatetime("", "00:00:00");
        let to = Util.getValidDatetime("", "23:59:59");
        // Check is leader
        let dbUserid = dbUser.id;
        let dbGroups = await Groupss.findAll({
            where: { leader: dbUserid }
        });
        if (dbGroups.length == 0) {
            reply = settings.not_leader;
            return BOT.sendMessage(chatId, standardizedReplyMessage(reply, { user_id: user_id, username: username }))
        }
        let content = "";
        if (action == undefined || action == "work") {
            content += `Thành viên đang làm việc\n`;
            for (let index = 0; index < dbGroups.length; index++) {
                const element = dbGroups[index];
                content += `-- Nhóm ${element.group_code}: ${element.group_name}\n`;
                let working = await GroupssService.getWorkingUsers(element.id, from, to, "")
                for (let i = 0; i < working.length; i++) {
                    const uss = working[i];
                    content += `+ ID:${uss.user_id}, ${uss.full_name}, ${uss.class_code}-${uss.room}\n`;
                }
            }
            return BOT.sendMessage(chatId, standardizedReplyMessage(content, { user_id: user_id, username: username }))
        } else {
            content += `Thành viên đang rảnh\n`;
            for (let index = 0; index < dbGroups.length; index++) {
                const element = dbGroups[index];
                content += `-- Nhóm ${element.group_code}: ${element.group_name}\n`;
                // 
                let group_id = element.id;
                let all_member = await GroupssService.getGroupMembers(group_id)
                let sub = [];
                let all = [];
                let workk_members = await GroupssService.getWorkingUsers(group_id, from, to, "");

                for (let index = 0; index < workk_members.length; index++) {
                    const element = workk_members[index];
                    all.push(element.user_id)
                }

                for (let index = 0; index < all_member.length; index++) {
                    const element = all_member[index];
                    if (!all.includes(element.member_id)) {
                        sub.push(element.member_id)
                    }
                }
                if (sub.length > 0) {
                    let free_members = await GroupssService.getFreeUsers(group_id, from, to, sub);
                    for (let i = 0; i < free_members.length; i++) {
                        const uss = free_members[i];
                        content += `+ ID:${uss.user_id}, ${uss.full_name}\n`;
                    }
                }
            }
            return BOT.sendMessage(chatId, standardizedReplyMessage(content, { user_id: user_id, username: username }))
        }


    });

}
async function close_bot() {

}
module.exports = {
    init_bot,
    close_bot,
    BOT
}