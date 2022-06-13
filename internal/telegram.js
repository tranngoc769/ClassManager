const MAX_STACK = 50
var STACK = []
var TelegramBot = require('node-telegram-bot-api');
const TimeOut = 3600;
var BOT;
const Users = require('../models').Users;
const Settings = require('../models').Settings;
const UsersService = require('../services/users');
const SettingsService = require('../services/settings');
// SQL
var emoji = require('node-emoji').emoji;

function convert_emoji(msg) {
    msg = msg.replace(/\#pleading_face+/g, emoji['pleading_face']);
    msg = msg.replace(/\#relaxed+/g, emoji['relaxed']);
    msg = msg.replace(/\#grin+/g, emoji['grin']);
    msg = msg.replace(/\#kissing_heart+/g, emoji['kissing_heart']);
    return msg;
}

async function init_bot() {
    const bot_token = await Settings.findOne({ where: { name: "bot_token" } });
    if (bot_token == null) {
        return false;
    }
    BOT = new TelegramBot(bot_token.value, { polling: true });
    BOT.onText(/\/dangky*/, async function(msg, match) {
        var chatId = msg.chat.id;
        let from = msg.from;
        // let users = {
        //     username: "@" + from.username,
        //     userid: from.id,
        //     extend: today,
        // }
        var settings = await SettingsService.getSettingByNames([{ name: "dangky_content" }, { name: "dangky_content" }])
        let status = await Users.findOne({
            where: { tele_id: from.id },
            someAttribute: {

            }
        });
        return
        const [user, created] = await Users.findOrCreate({
            where: { tele_id: from.id },
            defaults: {
                tele_id: from.id
            }
        });
        console.log(user.username); // 'sdepold'
        console.log(user.job); // This may or may not be 'Technical Lead JavaScript'
        console.log(created); // The boolean indicating whether this instance was just created
        if (created) {
            console.log(user.job); // This will certainly be 'Technical Lead JavaScript'
        }

        let content = "";
        if (status == null) {
            let created_user = Users.Cre
            content = await mUser.dangkycontent();
            content = content.replace("@username", "@" + from.username)
        } else {
            let ngayconlai = await mUser.ngayconlai(from.id, "telegram")
            content = await mUser.dadangkycontent();
            content = content.replace("@username", "@" + from.username)
            content = content.replace("@USERNAME", "@" + from.username)
            content = content.replace("@songay", ngayconlai)
            content = content.replace("@SONGAY", ngayconlai)
        }
        content = convert_emoji(content)
        if (msg.reply_to_message != undefined) {
            try {
                BOT.sendMessage(chatId, content, { reply_to_message_id: msg.message_id })
            } catch (error) {

            }
        } else {
            BOT.sendMessage(chatId, content);
        }
    });
    return
    BOT.onText(/\/kiemtra*/, async function(msg, match) {
        var chatId = msg.chat.id;
        let userid = msg.from.id;
        let username = msg.from.username;
        insert_id(msg.chat.id)
        let ngayconlai = await mUser.ngayconlai(userid, "telegram")
        if (ngayconlai == false) {
            BOT.sendMessage(chatId, "Người dùng @" + username + " không tồn tại");
            return;
        }
        let content = await mUser.kiemtrangay()
        content = content.replace("@USERNAME", "@" + username)
        content = content.replace("@SONGAY", ngayconlai)
        content = content.replace("@username", "@" + username)
        content = content.replace("@songay", ngayconlai)
        content = convert_emoji(content)
        if (msg.reply_to_message != undefined) {
            try {
                BOT.sendMessage(chatId, content, { reply_to_message_id: msg.message_id })
            } catch (error) {

            }
        } else {
            BOT.sendMessage(chatId, content);
        }
    });
    BOT.onText(/\/dangky*/, async function(msg, match) {
        var chatId = msg.chat.id;
        let from = msg.from;
        insert_id(msg.chat.id)
        var dt = new Date();
        var today = `${dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`
        let msg_date = `${dt.getDate().toString().padStart(2, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getFullYear().toString().padStart(4, '0')}`;
        let users = {
            username: "@" + from.username,
            userid: from.id,
            extend: today,
        }
        let status = await mUser.dangky(users, "telegram")
        let content = "";
        if (status) {
            content = await mUser.dangkycontent();
            content = content.replace("@username", "@" + from.username)
            content = content.replace("@USERNAME", "@" + from.username)
            content = content.replace("@ngaykichhoat", msg_date)
            content = content.replace("@NGAYKICHHOAT", msg_date)
        } else {
            let ngayconlai = await mUser.ngayconlai(from.id, "telegram")
            content = await mUser.dadangkycontent();
            content = content.replace("@username", "@" + from.username)
            content = content.replace("@USERNAME", "@" + from.username)
            content = content.replace("@songay", ngayconlai)
            content = content.replace("@SONGAY", ngayconlai)
        }
        content = convert_emoji(content)
        if (msg.reply_to_message != undefined) {
            try {
                BOT.sendMessage(chatId, content, { reply_to_message_id: msg.message_id })
            } catch (error) {

            }
        } else {
            BOT.sendMessage(chatId, content);
        }
    });
}

module.exports = {
    init_bot,
    BOT
}