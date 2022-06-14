'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Histories extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Histories.init({
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
        checkin: {
            type: DataTypes.DATE,
            allowNull: true
        },
        checkout: {
            type: DataTypes.DATE,
            allowNull: true
        },
        room: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Histories',
    });
    return Histories;
};