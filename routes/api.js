const express = require('express');
const router = express.Router();
const models = require('../models');

/* Route handling code for '/api/*' routes. */

router.get('/income', function(req, res, next) {
  if (req.query.limit !== undefined) {
    req.limitNumber = Number(req.query.limit);

    if (Number.isNaN(req.limitNumber)) {
      return res.status(404).json({'msg': 'wrong query'});
    }
  }

  models.Record.findAll({
    where: {
      RecordType: 'Income',
    },
    limit: req.limitNumber}).then((records) => {
    if (records == null) {
      return res.status(404).json({msg: 'no data'});
    } else {
      return res.status(200).json(records);
    }
  });
});

router.get('/expenses', function(req, res, next) {
  if (req.query.limit !== undefined) {
    req.limitNumber = Number(req.query.limit);

    if (Number.isNaN(req.limitNumber)) {
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

router.get('/income/:id', function(req, res, next) {
  models.Record.findOne({
    where: {
      RecordID: req.params.id,
      RecordType: 'Income',
    },
  }).then((record) => {
    if (record == null) {
      return res.status(404).json({msg: 'no data'});
    } else {
      return res.status(200).json(record);
    }
  });
});

router.get('/expenses/:id', function(req, res, next) {
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
