const assert = require('assert');
const httpMocks = require('node-mocks-http');
const ma = require('../utils/auth_middleware');
const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

const noop = function() {
  return;
};

const TESTUSER = 'testuser';
const TESTPASS = 'testpass';

describe('Authorization middleware', function() {
  before(function() {
    const token = jwt.sign({loggedInAs: TESTUSER}, config.secret);
    requestJwt = httpMocks.createRequest({
      method: 'POST',
      url: '/login',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      body: {
        username: TESTUSER,
        password: TESTPASS,
      },
    });

    const badToken = jwt.sign({loggedInAs: TESTUSER}, 'badsecret');

    badRequest = httpMocks.createRequest({
      method: 'POST',
      url: '/login',
      headers: {
        'Authorization': 'Bearer ' + badToken,
      },
      body: {
        password: 'a',
      },
    });

    response = httpMocks.createResponse();
  });

  beforeEach(function() {
    response = httpMocks.createResponse();
  });

  describe('#checkToken', function() {
    it('verifies the JWT correctly', function() {
      ma.checkToken(requestJwt, response, noop);
      assert.notStrictEqual(response.statusCode, 403);
      assert.notStrictEqual(response.statusCode, 401);
      assert.strictEqual(requestJwt.user, TESTUSER);
    });

    it('fails with bad token', function() {
      ma.checkToken(badRequest, response, noop);
      assert.strictEqual(response.statusCode, 403);
      const data = response._getJSONData();
      assert.ok(data.Error);
    });

    it('fails without Authorization header', function() {
      ma.checkToken(httpMocks.createRequest(), response, noop);
      assert.strictEqual(response.statusCode, 401);
      const data = response._getJSONData();
      assert.ok(data.Error);
    });
  });

  describe('#checkBodyPopulated', function() {
    it('verifies if req.body has proper fields', function() {
      ma.checkBodyPopulated(requestJwt, response, () => {
        assert.ok(true);
      });
      assert.notStrictEqual(response.statusCode, 400);
    });

    it('fails without username or password in req.body', function() {
      ma.checkBodyPopulated(badRequest, response, () => {
        assert.ok(false);
      });
      assert.strictEqual(response.statusCode, 400);
      const data = response._getJSONData();
      assert.ok(data.Error);
    });
  });

  describe('#checkPassword', function() {
    it('checks if password provided meets requirements', function() {
      ma.checkPassword(requestJwt, response, () => {
        assert.ok(true);
      });
      assert.notStrictEqual(response.statusCode, 400);
    });

    it('fails with too short password', function() {
      ma.checkPassword(badRequest, response, () => {
        assert.ok(false);
      });
      assert.strictEqual(response.statusCode, 400);
      const data = response._getJSONData();
      assert.ok(data.Error);
    });
  });
});
