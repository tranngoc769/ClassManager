'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Histories', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            time_keep: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0
            },
            is_paid: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: 0
            },
            class_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'class_id is required'
                    }
                }
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            action: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: ""
            },
            checkin: {
                type: DataTypes.DATE,
                allowNull: true
            },
            checkout: {
                type: DataTypes.DATE,
                allowNull: true
            },
            paid_date: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: DataTypes.NOW
            },
            room: {
                type: DataTypes.STRING,
                allowNull: true
            },
            salary: {
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
        await queryInterface.dropTable('Histories');
    }
};