'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Users.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_level: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "Teacher"
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        is_delete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        tele_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        tele_user: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'tele_user is required'
                }
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        social: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        day_salary: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0
        },
        thi_salary: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0
        },
        dv_salary: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'Users',
    });
    return Users;
};