'use strict';
const Groups = require('../models').Groups;
var sequelize = require('../models/index').sequelize;
const { QueryTypes } = require('sequelize');

module.exports = {
    getAllGroups: async() => {
        let groups = await sequelize.query(
            'SELECT g.id, g.is_delete, g.group_code, g.group_name, g.leader, g.createdAt, g.updatedAt, u.full_name, u.phone FROM groups AS g JOIN users AS u ON g.leader = u.id  order by g.is_delete', {
                type: QueryTypes.SELECT
            }
        );
        return groups;
    },
    getGroupsByLeader: async(leader) => {
        let groups = await sequelize.query(
            'SELECT g.id, g.is_delete, g.group_code, g.group_name, g.leader, g.createdAt, g.updatedAt, u.full_name, u.phone FROM groups AS g JOIN users AS u ON g.leader = u.id where leader = ? and g.is_delete = 0', {
                replacements: [leader],
                type: QueryTypes.SELECT
            }
        );
        return groups;
    },
    getGroupMembers: async(group_id) => {
        let users = await sequelize.query(
            'SELECT gm.id, gm.group_id, gm.member_id, gm.createdAt, gm.updatedAt, u.full_name, u.phone, u.tele_user, u.tele_id FROM groupmembers AS gm JOIN users AS u ON gm.member_id = u.id WHERE gm.group_id = ? and u.is_delete = 0', {
                replacements: [group_id],
                type: QueryTypes.SELECT
            }
        );
        return users;
    },
    getSummarySalary: async(group_id, from, to, user_id) => {
        let other = '';
        if (user_id != undefined && !isNaN(user_id)) {
            other = "u.id = " + user_id + " and "
        }
        // let sql = `SELECT cl.class_code,h.id, h.time_keep, h.salary, (select sum(salary) from histories WHERE user_id = h.user_id and action = 'DAY' and checkin BETWEEN '${from}' and '${to}') as total_day, (select sum(salary) from histories WHERE user_id = h.user_id and action = 'THI' and checkin BETWEEN '${from}' and '${to}') as total_thi, (select sum(salary) from histories WHERE user_id = h.user_id and action = 'DV' and checkin BETWEEN '${from}' and '${to}') as total_dv, h.is_user_paid, h.class_id, h.user_id, h.action, h.description, h.checkin, h.checkout, h.paid_date, h.room, h.createdAt, h.updatedAt, u.tele_id, u.tele_user, u.full_name, u.phone FROM histories AS h JOIN groupmembers AS gm ON h.user_id = gm.member_id join classes cl on cl.id = h.class_id JOIN users AS u ON h.user_id = u.id WHERE ${other} h.checkin BETWEEN '${from}' and '${to}' and h.checkout is not null and gm.group_id = ${group_id}`;
        let sql = `SELECT h.id, h.is_center_paid,h.center_paid_date, cl.class_code,h.id, h.time_keep,h.salary, h.turn_over,h.sumary_price, h.is_user_paid, h.class_id, h.user_id, h.action, h.description, h.checkin, h.checkout, h.paid_date, h.room, h.createdAt, h.updatedAt, u.tele_id, u.tele_user, u.full_name, u.phone FROM histories AS h JOIN groupmembers AS gm ON h.user_id = gm.member_id join classes cl on cl.id = h.class_id JOIN users AS u ON h.user_id = u.id WHERE ${other} h.checkin BETWEEN '${from}' and '${to}' and u.is_delete = 0 and h.checkout is not null and gm.group_id = ${group_id}`;

        let all_salary = await sequelize.query(sql, {
            type: QueryTypes.SELECT
        });
        return all_salary;
    },

    getClassReport: async(group_id, from, to) => {
        let sql = `select COUNT(cl.id) as total,SUM(salary) as salary,SUM(sumary_price) as center_payment,SUM(turn_over) as turn_over, cl.id, cl.class_code, cl.class_name from histories h join classes cl on h.class_id = cl.id
        join groupmembers gm on h.user_id = gm.member_id
        WHERE h.checkin BETWEEN '${from}' and '${to}' and cl.is_delete = 0 and h.checkout is not null and gm.group_id = ${group_id}
        GROUP BY h.class_id`;
        let all_salary = await sequelize.query(sql, {
            type: QueryTypes.SELECT
        });
        return all_salary;
    },
    getWorkingUsers: async(group_id, from, to, isNull) => {
        let sql = `SELECT u.tele_id, u.tele_user, u.full_name, u.phone, u.address, u.social, u.updatedAt, u.createdAt, u.day_salary, u.thi_salary, u.dv_salary, u.is_delete, u.user_level FROM histories AS h JOIN groupmembers AS gm ON h.user_id = gm.member_id JOIN classes AS cl ON cl.id = h.class_id JOIN users AS u ON h.user_id = u.id WHERE   h.checkout is ${isNull} null  and u.is_delete = 0 and h.checkin BETWEEN '${from}' and '${to}' and gm.group_id = ${group_id} group by h.user_id`
        let all_salary = await sequelize.query(sql, {
            type: QueryTypes.SELECT
        });
        return all_salary;
    }

};