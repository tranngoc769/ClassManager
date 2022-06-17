'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('groups', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            is_delete: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            group_code: {
                type: Sequelize.STRING,
                allowNull: false
            },
            group_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            leader: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('groups');
    }
};