'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const pass1 = bcrypt.hashSync('strongpass', 16);
    const pass2 = bcrypt.hashSync('ezpz', 16);

    return queryInterface.bulkInsert('Users', [{
      Name: 'makos',
      Password: pass1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      Name: 'notroot',
      Password: pass2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
