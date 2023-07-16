"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("1234-Purwadhika", 10);
    return queryInterface.bulkInsert("Users", [
      {
        email: "admin@gmail.com",
        password: hashedPassword,
        role_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "grace_employee@gmail.com",
        password: hashedPassword,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "james_employee_2@gmail.com",
        password: hashedPassword,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
