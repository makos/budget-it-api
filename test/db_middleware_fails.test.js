const models = require('../models');
const assert = require('assert');
const httpMocks = require('node-mocks-http');
const m = require('../utils/api_middleware');

describe('Database middleware - failures', function() {
  before(function(done) {
    models.sequelize.close().then(() => {
      done();
    });
  });

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

  describe('#getAllRecords', function() {
    it(
        'returns code 500 and error message when DB is not present',
        async function() {
          await m.getAllRecords(request, response);
          assert.strictEqual(response.statusCode, 500);
        });
  });

  describe('#getOneRecord', function() {
    it(
        'returns code 500 and error message when DB is not present',
        async function() {
          await m.getOneRecord(request, response);
          assert.strictEqual(response.statusCode, 500);
        });
  });

  describe('#postRecord', function() {
    it(
        'returns code 500 and error message when DB is not present',
        async function() {
          request.body.amount = 1;
          request.user = 'makos';
          await m.postRecord(request, response);
          assert.strictEqual(response.statusCode, 500);
        });
  });

  describe('#deleteRecord', function() {
    it(
        'returns code 500 and error message when DB is not present',
        async function() {
          await m.deleteRecord(request, response);
          assert.strictEqual(response.statusCode, 500);
        });
  });

  describe('#putRecord', function() {
    it(
        'returns code 500 and error message when DB is not present',
        async function() {
          await m.putRecord(request, response);
          assert.strictEqual(response.statusCode, 500);
        });
  });
});
