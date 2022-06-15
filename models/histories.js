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
        salary: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0
        },
        sumary_price: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0
        },
        turn_over: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0
        },
        is_user_paid: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 0
        },
        is_center_paid: {
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
        center_paid_date: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
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