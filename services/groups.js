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


};