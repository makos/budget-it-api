var express = require('express');
var router = express.Router();
var models = require('../models');
var { checkIfNullJSON } = require('../utils');

/* GET home page. */
router.get('/', function(req, res, next) {
    models.Record.findAll().then(records => {
        if (!checkIfNullJSON(records)) {
            res.status(200).json(records);
        } else {
            res.status(404).json({ "msg": "no data" });
        }
    })
});

router.get('/:id', function(req, res, next) {
    models.Record.findByPk(req.params.id).then(record => {
        if (!checkIfNullJSON(record)) {
            res.status(200).json(record);
        } else {
            res.status(404).json({ "msg": "no data" });
        }
    })
})

module.exports = router;
