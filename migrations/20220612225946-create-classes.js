'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Classes', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            class_code: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'class_code is required'
                    }
                },
                unique: true
            },
            class_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false
            },
            min_price: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0
            },
            min_price: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0
            },
            term_price: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0
            },
            debit: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Classes');
    }
};