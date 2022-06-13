'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Classes', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            created_by: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            class_code: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'class_code is required'
                    }
                },
                unique: true
            },
            class_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false
            },
            min_price: {
                type: Sequelize.FLOAT,
                allowNull: true,
                defaultValue: 0
            },
            min_price: {
                type: Sequelize.FLOAT,
                allowNull: true,
                defaultValue: 0
            },
            term_price: {
                type: Sequelize.FLOAT,
                allowNull: true,
                defaultValue: 0
            },
            other_price: {
                type: Sequelize.FLOAT,
                allowNull: true,
                defaultValue: 0
            },
            is_delele: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            debit: {
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
        await queryInterface.dropTable('Classes');
    }
};