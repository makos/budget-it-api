var assert = require('assert');
var { checkIfNullJSON } = require('../utils');


describe('Utils', function() {
    before('Setup global variables', function() {
        testJson = { "thing": "thing2" };
        nullJson = null;
    });

    describe('#checkIfNullJSON(record)', function() {
        it('Should return true when record is not null', function() {
            assert.ok(testJson);
        });

        it('Should return false when record is null', function() {
            assert.ok(!nullJson);
        });
    });
});

