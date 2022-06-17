'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_level: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            tele_id: {
                type: Sequelize.BIGINT,
                allowNull: true
            },
            username: {
                type: Sequelize.STRING,
                allowNull: true
            },
            password: {
                type: Sequelize.STRING,
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
            is_delete: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            day_salary: {
                type: Sequelize.FLOAT,
                allowNull: true,
                defaultValue: 0
            },
            thi_salary: {
                type: Sequelize.FLOAT,
                allowNull: true,
                defaultValue: 0
            },
            dv_salary: {
                type: Sequelize.FLOAT,
                allowNull: true,
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