"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Employees", [
      {
        first_name: "Grace",
        last_name: "Employee",
        birth_date: "1999-02-01 00:00:00",
        join_date: "2023-07-12 00:00:00",
        user_id: 2,
        salary_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        first_name: "James",
        last_name: "Employee",
        birth_date: "1999-12-09 00:00:00",
        join_date: "2020-10-12 00:00:00",
        user_id: 3,
        salary_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
