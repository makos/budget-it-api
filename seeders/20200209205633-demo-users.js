'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      Name: 'makos',
      Password: 'thiswillbeahash',
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    }, {
      Name: 'notroot',
      Password: 'ezpz',
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
