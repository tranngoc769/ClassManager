'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Groupss extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Groupss.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        is_delete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        group_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        group_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        leader: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        sequelize,
        modelName: 'Groupss',
    });
    return Groupss;
};