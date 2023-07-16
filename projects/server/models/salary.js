"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Salary extends Model {
    static associate(models) {
      Salary.hasOne(models.Employee, { foreignKey: "salary_id" });
    }
  }
  Salary.init(
    {
      basic_salary: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Salary",
      timestamps: false,
    }
  );
  return Salary;
};
