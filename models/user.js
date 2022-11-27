'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Schedule,{
        foreignKey:"uid",
        onDelete:"cascade",
      });
      this.hasMany(models.UserTime,{
        foreignKey:"uid",
        onDelete:"cascade",
      });
    }
  }
  User.init(
  {
    //  https://stackoverflow.com/questions/33775165/auto-increment-id-with-sequelize-in-mysql
    uid: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    username: {
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