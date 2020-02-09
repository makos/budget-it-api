'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.renameColumn("Records", "ExpenseType", "RecordType");
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.renameColumn("Records", "RecordType", "ExpenseType");
  }
};
