'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Histories', {
            class_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            checkin: {
                type: Sequelize.DATE,
                allowNull: true
            },
            checkout: {
                type: Sequelize.DATE,
                allowNull: true
            },
            room: {
                type: Sequelize.STRING,
                allowNull: true
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
        await queryInterface.dropTable('History');
    }
};