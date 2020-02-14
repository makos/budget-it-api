const assert = require('assert');
const httpMocks = require('node-mocks-http');
const m = require('../utils/api_middleware');

const noop = function() {
  return;
};

describe('API middleware for requests & responses', function() {
  before(function() {
    // request objects without searchClause defined, for setRecordType.
    requestEmptyExpenses = httpMocks.createRequest({
      method: 'GET',
      url: '/api/expenses',
    });
    requestEmptyIncome = httpMocks.createRequest({
      method: 'GET',
      url: '/api/income',
    });

    response = httpMocks.createResponse();
  });

  beforeEach(function() {
    // searchClause needs to be defined for all middleware to work properly,
    // except for setRecordType() which actually sets it.
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api/income',
      searchClause: {
        where: {},
      },
    });

    response = httpMocks.createResponse();
  });

  describe('#setRecordType', function() {
    it('sets req.searchClause', function() {
      m.setRecordType(requestEmptyExpenses, response, noop);
      assert.ok(requestEmptyExpenses.searchClause);
    });

    it('sets req.searchClause.where.RecordType appropriately', function() {
      m.setRecordType(requestEmptyIncome, response, noop);
      m.setRecordType(requestEmptyExpenses, response, noop);
      assert.strictEqual(
          requestEmptyIncome.searchClause.where.RecordType,
          'Income',
      );
      assert.strictEqual(
          requestEmptyExpenses.searchClause.where.RecordType,
          'Expense',
      );
    });
  });

  describe('#setDateRange', function() {
    it('sets req.searchClause.where.Date', function() {
      request.query.dateFrom = '2020-01-01';
      request.query.dateTo = '2020-01-02';

      m.setDateRange(request, response, noop);
      assert.ok(request.searchClause.where.Date);
    });

    it('fails setting req.searchClause.where.date with wrong input', function() {
      request.query.dateFrom = '2o2o-o1-o1';
      request.query.dateTo = 'Monday';
      m.setDateRange(request, response, noop);
      const data = response._getJSONData();
      assert.strictEqual(response.statusCode, 400);
      assert.ok(data.Error);
    });
  });

  describe('#setLimit', function() {
    it('sets req.searchClause.limit appropriately', function() {
      request.query.limit = '3';
      m.setLimit(request, response, noop);
      assert.strictEqual(request.searchClause.limit, 3);
    });

    it('fails setting req.searchClause.limit with wrong input', function() {
      request.query.limit = 'notanint';
      m.setLimit(request, response, noop);
      const data = response._getJSONData();
      assert.strictEqual(response.statusCode, 400);
      assert.ok(data.Error);
    });
  });

  describe('#setId', function() {
    it('sets req.searchClause.where.RecordID appropriately', function() {
      request.params.id = '25';
      m.setId(request, response, noop);
      assert.strictEqual(request.searchClause.where.RecordID, 25);
    });

    it('fails setting req.searchClause.where.RecordID with wrong input',
        function() {
          request.params.id = 'asdf';
          m.setId(request, response, noop);
          const data = response._getJSONData();
          assert.strictEqual(response.statusCode, 400);
          assert.ok(data.Error);
        });
  });

  describe('#setUser', function() {
    it('sets req.searchClause.where.UserName appropriately', function() {
      request.user = 'testuser';
      m.setUser(request, response, noop);
      assert.strictEqual(request.searchClause.where.UserName, 'testuser');
    });

    it('fails if no req.user is present', function() {
      m.setUser(request, response, noop);
      assert.strictEqual(response.statusCode, 401);
      const data = response._getJSONData();
      assert.ok(data['Error (setUser)']);
    });
  });

  describe('#postRecord', function() {
    it('fails to POST new record if no req.body.amount is given', function() {
      m.postRecord(request, response, noop);
      const data = response._getJSONData();
      assert.strictEqual(response.statusCode, 400);
      assert.ok(data.Error);
    });
  });
});
