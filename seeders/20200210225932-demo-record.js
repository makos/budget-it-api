'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Records', [{
      Amount: 10.2,
      Date: new Date(),
      Type: 'Food',
      Comment: 'McDonald\'s',
      RecordType: 'Expense',
      UserName: 'makos',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      Amount: 99.9,
      Date: new Date(),
      Type: 'Media',
      Comment: 'Hosting',
      RecordType: 'Expense',
      UserName: 'notroot',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      Amount: 199.9,
      Date: new Date(),
      Type: 'Paycheck',
      Comment: '',
      RecordType: 'Income',
      UserName: 'makos',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Records', null, {});
  },
};
