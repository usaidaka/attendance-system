"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payroll extends Model {
    static associate(models) {
      Payroll.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Payroll.init(
    {
      user_id: DataTypes.INTEGER,
      date: DataTypes.DATE,
      payroll: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Payroll",
    }
  );
  return Payroll;
};
