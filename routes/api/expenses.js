const express = require('express');
const router = express.Router();
const models = require('../../models');

router.get('/', function(req, res, next) {
  // /api/expenses?limit=[INTEGER] to limit number of returned records.
  if (req.query.limit !== undefined) {
    req.limitNumber = Number(req.query.limit);

    if (Number.isNaN(req.limitNumber)) {
      return res.status(404).json({'msg': 'wrong query'});
    }
  }

  // /api/expenses?dateFrom=[DATESTRING]&dateTo=[DATESTRING] to filter based on
  // dates.
  if (req.query.dateFrom !== undefined && req.query.dateTo !== undefined) {
    req.dateFrom = new Date(req.query.dateFrom);
    req.dateTo = new Date(req.query.dateTo);

    if (req.dateFrom == "Invalid Date" || req.dateTo == "Invalid Date") {
      return res.status(404).json({'msg': 'wrong query'});
    }
  }

  models.Record.findAll({
    where: {
      RecordType: 'Expense',
    },
    limit: req.limitNumber}).then((records) => {
    if (records == null) {
      return res.status(404).json({msg: 'no data'});
    } else {
      return res.status(200).json(records);
    }
  });
});

router.get('/:id', function(req, res, next) {
  models.Record.findOne({
    where: {
      RecordID: req.params.id,
      RecordType: 'Expense',
    },
  }).then((record) => {
    if (record == null) {
      return res.status(404).json({msg: 'no data'});
    } else {
      return res.status(200).json(record);
    }
  });
});

module.exports = router;
