"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: "role_id" });
      User.hasOne(models.Employee, { foreignKey: "user_id" });
      User.belongsTo(models.Attendance, { foreignKey: "user_id" });
      User.hasMany(models.Payroll, { foreignKey: "user_id" });
    }
  }
  User.init(
    {
      email: { type: DataTypes.STRING, allowNull: true, unique: true },
      password: { type: DataTypes.STRING, allowNull: true },
      token_confirmation: DataTypes.STRING,
      token_confirmation_createdAt: { type: DataTypes.DATE, allowNull: true },
      role_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2 },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
