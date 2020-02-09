'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      ID: {
        allowNull: false,
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER,
      },
      Name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      Password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      CreatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      UpdatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  },
};
