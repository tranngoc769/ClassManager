'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('histories', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            time_keep: {
                type: Sequelize.FLOAT,
                allowNull: true,
                defaultValue: 0
            },
            salary: {
                type: Sequelize.FLOAT,
                allowNull: true,
                defaultValue: 0
            },
            sumary_price: {
                type: Sequelize.FLOAT,
                allowNull: true,
                defaultValue: 0
            },
            turn_over: {
                type: Sequelize.FLOAT,
                allowNull: true,
                defaultValue: 0
            },
            is_user_paid: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            },
            is_center_paid: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            },
            class_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'class_id is required'
                    }
                }
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            action: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: ""
            },
            checkin: {
                type: Sequelize.DATE,
                allowNull: true
            },
            checkout: {
                type: Sequelize.DATE,
                allowNull: true
            },
            paid_date: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.NOW
            },
            center_paid_date: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.NOW
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
        await queryInterface.dropTable('histories');
    }
};