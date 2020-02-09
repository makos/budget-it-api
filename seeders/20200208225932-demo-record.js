'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Records', [{
          Amount: 10.2,
          Date: new Date(),
          Type: 'Food',
          Comment: "McDonald's",
          ExpenseType: 'Expense'
      }, {
          Amount: 99.9,
          Date: new Date(),
          Type: 'Media',
          Comment: "Hosting",
          ExpenseType: 'Expense'
      }, {
          Amount: 199.9,
          Date: new Date(),
          Type: 'Paycheck',
          Comment: "",
          ExpenseType: 'Income'
      }]);
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Records', null, {});
  }
};
