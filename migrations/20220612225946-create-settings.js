'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Settings', {
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true
            },
            value: {
                type: Sequelize.STRING,
                allowNull: false
            },
            index: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 1
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
        await queryInterface.dropTable('Settings');
    }
};