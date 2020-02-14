const assert = require('assert');
const httpMocks = require('node-mocks-http');
const m = require('../utils/api_middleware');
const ma = require('../utils/auth_middleware');

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

  describe('#checkIfUserExists', function() {
    it('passes control to next() when user not found', async function() {
      request.body.username = 'zzzxxxx';
      await ma.checkIfUserExists(request, response, () => {
        assert.ok(true);
      });
    });

    it('fails when user exists in DB', async function() {
      request.body.username = 'makos';
      await ma.checkIfUserExists(request, response, () => {
        assert.ok(false);
      });
      assert.strictEqual(response.statusCode, 400);
      const data = response._getJSONData();
      assert.ok(data.Error);
    });
  });

  describe('#createNewUser', function() {
    it('creates new user in the DB with proper name and ID', async function() {
      request.body.username = 'newuser';
      request.passwordHash = 'goodpass';
      await ma.createNewUser(request, response);
      const data = response._getJSONData();
      assert.strictEqual(data.Created.Name, 'newuser');
      assert.strictEqual(data.Created.Password, 'goodpass');
      assert.strictEqual(response.statusCode, 200);
    });
  });
});
