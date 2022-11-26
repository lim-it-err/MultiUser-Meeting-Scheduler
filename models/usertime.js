'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserTime extends Model {
    static associate(models) {
      this.belongsTo(models.Schedule,{
        foreignKey: "schedule_id",
        onDelete: "cascade",
      });
      this.belongsTo(models.User,{
        foreignKey: "uid",
        onDelete: "cascade",
      });
    }
  }
  UserTime.init(
  {
    time_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    start_time: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    end_time: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    timestamps:true,
    charset: "utf8",
    collate : 'utf8_general_ci',
    modelName: 'UserTime',
  });
  return UserTime;
};