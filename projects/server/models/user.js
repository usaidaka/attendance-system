"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, { foreignKey: "role_id" });
      User.hasOne(models.Employee, { foreignKey: "user_id" });
      User.belongsTo(models.Attendance, { foreignKey: "user_id" });
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
