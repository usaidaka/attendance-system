"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.hasMany(models.User, { foreignKey: "user_id" });
    }
  }
  Attendance.init(
    {
      user_id: DataTypes.INTEGER,
      clock_in: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: null,
      },
      clock_out: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: null,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      isValid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );
  return Attendance;
};
