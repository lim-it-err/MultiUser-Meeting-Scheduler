'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      this.belongsTo(models.User,{
        as:"user",
        foreignKey: "uid",
        onDelete: "cascade",
      });
    }
  }
  Schedule.init(
  {
    name: {
      field: "users_id",
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    sched_day: {
      type:DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    timestamps:true,
    charset: "utf8",
  });
  return Schedule;
}