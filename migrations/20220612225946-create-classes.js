'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Classes', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
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
            created_by: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            price: {
                type: Sequelize.FLOAT,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'price is required'
                    }
                }
            },
            exam_price: {
                type: Sequelize.FLOAT,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'exam_price is required'
                    }
                }
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