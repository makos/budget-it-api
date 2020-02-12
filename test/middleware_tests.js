const assert = require('assert');
const httpMocks = require('node-mocks-http');
const m = require('../routes/middleware');

const noop = function() {
  return;
};

describe('Middleware functions for /api routes', function() {
  before(function() {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api/income',
    });

    requestExpenses = httpMocks.createRequest({
      method: 'GET',
      url: '/api/expenses',
    });

    response = httpMocks.createResponse();
  });

  beforeEach(function() {
    response = httpMocks.createResponse();
  });

  it('sets req.searchClause', function() {
    m.setRecordType(request, response, noop);
    assert.ok(request.searchClause);
  });

  it('sets req.searchClause.where.RecordType appropriately', function() {
    m.setRecordType(request, response, noop);
    m.setRecordType(requestExpenses, response, noop);
    assert.strictEqual(request.searchClause.where.RecordType, 'Income');
    assert.strictEqual(
        requestExpenses.searchClause.where.RecordType,
        'Expense');
  });

  it('sets req.searchClause.where.Date', function() {
    request.query.dateFrom = '2020-01-01';
    request.query.dateTo = '2020-01-02';

    m.setDateRange(request, response, noop);
    assert.ok(request.searchClause.where.Date);
  });

  it('sets req.searchClause.limit appropriately', function() {
    request.query.limit = '3';
    m.setLimit(request, response, noop);
    assert.strictEqual(request.searchClause.limit, 3);
  });

  it('sets req.searchClause.where.RecordID appropriately', function() {
    request.params.id = '25';
    m.setId(request, response, noop);
    assert.strictEqual(request.searchClause.where.RecordID, 25);
  });

  it('fails setting req.searchClause.limit with wrong input', function() {
    request.query.limit = 'notanint';
    m.setLimit(request, response, noop);
    const data = response._getJSONData();
    assert.strictEqual(response.statusCode, 400);
    assert.ok(data.Error);
  });

  it('fails setting req.searchClause.where.date with wrong input', function() {
    request.query.dateFrom = '2o2o-o1-o1';
    request.query.dateTo = 'Monday';
    m.setDateRange(request, response, noop);
    const data = response._getJSONData();
    assert.strictEqual(response.statusCode, 400);
    assert.ok(data.Error);
  });

  it('fails setting req.searchClause.where.RecordID with wrong input',
      function() {
        request.params.id = 'asdf';
        m.setId(request, response, noop);
        const data = response._getJSONData();
        assert.strictEqual(response.statusCode, 400);
        assert.ok(data.Error);
      });

  it('fails to POST new record if no req.body.amount is given', function() {
    m.postRecord(request, response, noop);
    const data = response._getJSONData();
    assert.strictEqual(response.statusCode, 400);
    assert.ok(data.Error);
  });
});
