'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Records', {
      RecordID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      Date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      Type: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
      },
      Comment: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
      },
      RecordType: {
        type: Sequelize.ENUM('Income', 'Expense'),
        allowNull: false,
      },
      UserName: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'Name',
        },
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Records');
  },
};
