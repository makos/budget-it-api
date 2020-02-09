var express = require('express');
var router = express.Router();
var models = require('../models');
var getRecords = require('./get_records');

router.get('/', function(req, res, next) {
    return res.status(404).json({ "msg": "no data" });
});

router.get('/api/:id', function(req, res, next) {
    models.Record.findByPk(req.params.id).then(record => {
        if (record == null) {
            return res.status(404).json({ "msg": "no data" });
        } else {
            return res.status(200).json(record);
        }
    });
});

router.get('/api', function(req, res, next) {
    if (req.query.limit !== undefined) {
        req.limitNumber = Number(req.query.limit);

        if (Number.isNaN(req.limitNumber)) {
            return res.status(404).json({ "msg": "wrong query" });
        }
    }

    next();   
});

router.use(getRecords);

module.exports = router;
