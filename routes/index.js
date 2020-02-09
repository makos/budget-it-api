var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
    models.Record.findAll().then(records => {
        res.json(records);
    })
});

router.get('/:id', function(req, res, next) {
    models.Record.findByPk(req.params.id).then(record => {
        res.json(record);
    })
})

module.exports = router;
