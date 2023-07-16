"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.Salary, { foreignKey: "salary_id" });
      Employee.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Employee.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      birth_date: DataTypes.DATE,
      join_date: DataTypes.DATE,
      user_id: DataTypes.INTEGER,
      salary_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Employee",
    }
  );
  return Employee;
};
