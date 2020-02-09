'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Records', {
      RecordID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },      
      Amount: { 
          type: Sequelize.DECIMAL(10,2),
          allowNull: false
      },
      Date: {
          type: Sequelize.DATEONLY,
          allowNull: false
      },
      Type: {
          type: Sequelize.TEXT('tiny'),
          allowNull: true,
          defaultValue: ''
      },
      Comment: {
          type: Sequelize.TEXT('tiny'),
          allowNull: true,
          defaultValue: ''
      },
      ExpenseType: {
          type: Sequelize.ENUM('Income', 'Expense'),
          allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Records');
  }
};
