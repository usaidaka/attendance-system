"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Salaries", [
      {
        basic_salary: 5000000,
      },
      {
        basic_salary: 2500000,
      },
      {
        basic_salary: 10000000,
      },
      {
        basic_salary: 7500000,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Salaries", null, {});
  },
};
