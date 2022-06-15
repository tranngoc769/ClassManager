'use strict';
const Groups = require('../models').Groups;
var sequelize = require('../models/index').sequelize;
const { QueryTypes } = require('sequelize');

module.exports = {
    getAllGroups: async() => {
        let groups = await sequelize.query(
            'SELECT g.id, g.is_delete, g.group_code, g.group_name, g.leader, g.createdAt, g.updatedAt, u.full_name, u.phone FROM groups AS g JOIN users AS u ON g.leader = u.id ', {
                type: QueryTypes.SELECT
            }
        );
        return groups;
    },
    getGroupsByLeader: async(leader) => {
        let groups = await sequelize.query(
            'SELECT g.id, g.is_delete, g.group_code, g.group_name, g.leader, g.createdAt, g.updatedAt, u.full_name, u.phone FROM groups AS g JOIN users AS u ON g.leader = u.id where leader = ?', {
                replacements: [leader],
                type: QueryTypes.SELECT
            }
        );
        return groups;
    },
    getSummarySalary: async(group_id, from, to) => {
        let sql = `SELECT cl.class_code,h.id, h.time_keep, h.salary, (select sum(salary) from histories WHERE user_id = h.user_id and action = 'DAY' and checkin BETWEEN '${from}' and '${to}') as total_day, (select sum(salary) from histories WHERE user_id = h.user_id and action = 'THI' and checkin BETWEEN '${from}' and '${to}') as total_thi, (select sum(salary) from histories WHERE user_id = h.user_id and action = 'DV' and checkin BETWEEN '${from}' and '${to}') as total_dv, h.is_paid, h.class_id, h.user_id, h.action, h.description, h.checkin, h.checkout, h.paid_date, h.room, h.createdAt, h.updatedAt, u.tele_id, u.tele_user, u.full_name, u.phone FROM histories AS h JOIN groupmembers AS gm ON h.user_id = gm.member_id join classes cl on cl.id = h.class_id JOIN users AS u ON h.user_id = u.id WHERE h.checkin BETWEEN '${from}' and '${to}' and h.checkout is not null and gm.group_id = ${group_id}`
        let all_salary = await sequelize.query(sql, {
            type: QueryTypes.SELECT
        });
        return all_salary;
    },
    getWorkingUsers: async(group_id, from, to) => {
        let sql = `SELECT
        cl.class_code,
        h.id,
        h.time_keep,
        h.salary,
        h.is_paid,
        h.class_id,
        h.user_id,
        h.action,
        h.description,
        h.checkin,
        h.checkout,
        h.paid_date,
        h.room,
        h.createdAt,
        h.updatedAt,
        u.tele_id,
        u.tele_user,
        u.full_name,
        u.phone 
    FROM
        histories AS h
        JOIN groupmembers AS gm ON h.user_id = gm.member_id
        JOIN classes cl ON cl.id = h.class_id
        JOIN users AS u ON h.user_id = u.id  WHERE h.checkout is null and h.checkin BETWEEN '${from}' and '${to}' and gm.group_id = ${group_id}`
        let all_salary = await sequelize.query(sql, {
            type: QueryTypes.SELECT
        });
        return all_salary;
    }

};