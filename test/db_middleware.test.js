const models = require('../models');
const assert = require('assert');
const httpMocks = require('node-mocks-http');
const m = require('../utils/api_middleware');

describe('Database middleware - success', function() {
  beforeEach(function() {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api/expenses',
      searchClause: {
        where: {
          RecordType: 'Expense',
        },
      },
    });
    response = httpMocks.createResponse();
  });

  before(function(done) {
    // Create the tables and records in a temporary SQLite3 database file.
    const queryInterface = models.sequelize.getQueryInterface();
    // CREATE TABLE USERS
    queryInterface.createTable('Users', {
      ID: {
        type: models.Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
      },
      Name: {
        type: models.Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      Password: {
        type: models.Sequelize.STRING,
        allowNull: false,
      },
      CreatedAt: models.Sequelize.DATE,
      UpdatedAt: models.Sequelize.DATE,
    }, {force: true}).then(function() {
      // INSERT TWO TEST USERS
      queryInterface.bulkInsert('Users', [{
        ID: 1,
        Name: 'makos',
        Password: 'testpass',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      }, {
        ID: 2,
        Name: 'notroot',
        Password: 'testpass',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      }]).then(function() {
        // CREATE TABLE RECORDS
        queryInterface.createTable('Records', {
          RecordID: {
            type: models.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          Amount: {
            type: models.Sequelize.DECIMAL(10, 2),
            allowNull: false,
          },
          Date: {
            type: models.Sequelize.DATEONLY,
            allowNull: false,
          },
          Type: {
            type: models.Sequelize.STRING,
            allowNull: true,
            defaultValue: '',
          },
          Comment: {
            type: models.Sequelize.STRING,
            allowNull: true,
            defaultValue: '',
          },
          RecordType: {
            type: models.Sequelize.ENUM('Income', 'Expense'),
            allowNull: false,
          },
          UserName: {
            type: models.Sequelize.STRING,
            allowNull: false,
            references: {
              model: 'Users',
              key: 'Name',
            },
          },
        }, {force: true}).then(function() {
          // INSERT THREE TEST RECORDS
          queryInterface.bulkInsert('Records', [{
            RecordID: 1,
            Amount: 10.2,
            Date: new Date().toISOString(),
            Type: 'Food',
            Comment: 'McDonald\'s',
            RecordType: 'Expense',
            UserName: 'makos',
          }, {
            RecordID: 2,
            Amount: 99.9,
            Date: new Date().toISOString(),
            Type: 'Media',
            Comment: 'Hosting',
            RecordType: 'Expense',
            UserName: 'notroot',
          }, {
            RecordID: 3,
            Amount: 199.9,
            Date: new Date().toISOString(),
            Type: 'Paycheck',
            Comment: '',
            RecordType: 'Income',
            UserName: 'makos',
          }]).then(function() {
            // ALL DONE, promises fulfilled.
            done();
          });
        });
      });
    });
  });

  describe('#getAllRecords', function() {
    it('gets an array of JSON records', async function() {
      await m.getAllRecords(request, response);
      const data = response._getJSONData();
      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(data[0].RecordID, 1);
      assert.strictEqual(data[0].UserName, 'makos');
    });
  });

  describe('#getOneRecord', function() {
    it('returns JSON with one record', async function() {
      request.searchClause.where.RecordID = 2;
      await m.getOneRecord(request, response);
      const data = response._getJSONData();
      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(data.RecordID, 2);
      assert.strictEqual(data.UserName, 'notroot');
    });
  });

  describe('#postRecord', function() {
    it('adds new Record and returns it as JSON', async function() {
      request.body.amount = '25.00';
      request.user = 'makos';
      await m.postRecord(request, response);
      const data = response._getJSONData();
      assert.strictEqual(response.statusCode, 200);
      assert.ok(data.Created);
      assert.strictEqual(data.Created.RecordID, 4);
      assert.strictEqual(data.Created.UserName, 'makos');
    });
  });

  describe('#deleteRecord', function() {
    it('deletes specified Record and returns it as JSON', async function() {
      request.searchClause.where.RecordID = 1;
      await m.deleteRecord(request, response);
      const data = response._getJSONData();
      assert.strictEqual(response.statusCode, 200);
      assert.ok(data.Deleted);
      assert.strictEqual(data.Deleted.RecordID, 1);
    });

    it('now getOneRecord returns empty JSON', async function() {
      request.searchClause.where.RecordID = 1;
      await m.getOneRecord(request, response);
      const data = response._getJSONData();
      assert.strictEqual(response.statusCode, 200);
      assert.ok(!data);
    });

    it('returns 404 when RecordID is not found', async function() {
      request.searchClause.where.RecordID = 1000;
      await m.deleteRecord(request, response);
      const data = response._getJSONData();
      assert.strictEqual(response.statusCode, 404);
    });
  });

  describe('#putRecord', function() {
    it('updates a Record properly', async function() {
      request.searchClause.where.RecordID = 2;
      request.body.amount = 1;
      request.body.comment = 'New comment';
      await m.putRecord(request, response);
      const data = response._getJSONData();
      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(data.Updated.RecordID, 2);
      assert.strictEqual(data.Updated.Amount, 1);
      assert.strictEqual(data.Updated.Comment, 'New comment');
    });

    it('updated Record persists', async function() {
      request.searchClause.where.RecordID = 2;
      await m.getOneRecord(request, response);
      const data = response._getJSONData();
      assert.strictEqual(data.RecordID, 2);
      assert.strictEqual(data.Amount, 1);
      assert.strictEqual(data.Comment, 'New comment');
    });
  });
});
