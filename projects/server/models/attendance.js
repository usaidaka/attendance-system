"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.hasMany(models.User, { foreignKey: "user_id" });
    }
  }
  Attendance.init(
    {
      user_id: DataTypes.INTEGER,
      clock_in: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      clock_out: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );
  return Attendance;
};
