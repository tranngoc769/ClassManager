'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Classes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Classes.init({
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
    }, {
        sequelize,
        modelName: 'Classes',
    });
    return Classes;
};