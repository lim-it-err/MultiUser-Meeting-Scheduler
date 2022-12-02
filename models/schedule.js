'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      this.belongsToMany(models.User,{
        foreignKey: "schedule_id",
        through: "UserSchedule",
      });
      this.hasMany(models.UserTime,{
        foreignKey:"schedule_id",
        onDelete:"cascade",
      });
    }
  }
  Schedule.init(
  {
    schedule_id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull : false,
    },
    name: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    sched_day: {
      type:DataTypes.DATEONLY,
      allowNull: false,
    }
  }, {
    sequelize,
    timestamps:true,
    charset: "utf8",
  });
  return Schedule;
}