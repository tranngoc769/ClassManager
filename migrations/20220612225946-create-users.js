'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            is_lead: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            tele_id: {
                type: Sequelize.BIGINT,
                allowNull: true
            },
            tele_user: {
                type: Sequelize.STRING,
                allowNull: true
            },
            address: {
                type: Sequelize.STRING,
                allowNull: true
            },
            social: {
                type: Sequelize.STRING,
                allowNull: true
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: true
            },
            full_name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            is_delele: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
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
        await queryInterface.dropTable('Users');
    }
};