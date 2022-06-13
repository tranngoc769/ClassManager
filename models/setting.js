'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Settings extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Settings.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'name is required'
                }
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'value is required'
                }
            }
        },
        index: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        }
    }, {
        sequelize,
        modelName: 'Settings',
    });
    return Settings;
};