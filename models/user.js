'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Schedule,{
        foreignKey: "uid",
        through: "UserSchedule",
      });
      this.hasMany(models.UserTime,{
        foreignKey:"uid",
        onDelete:"cascade",
      });
    }
  }
  User.init(
  {
    uid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
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
    modelName: 'User',
  });
  return User;
};