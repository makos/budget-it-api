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
    }, {
      Amount: 99.9,
      Date: new Date(),
      Type: 'Media',
      Comment: 'Hosting',
      RecordType: 'Expense',
      UserName: 'notroot',
    }, {
      Amount: 199.9,
      Date: new Date(),
      Type: 'Paycheck',
      Comment: '',
      RecordType: 'Income',
      UserName: 'makos',
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Records', null, {});
  },
};
