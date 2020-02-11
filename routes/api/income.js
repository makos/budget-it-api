const express = require('express');
const router = express.Router();
const models = require('../../models');
const {Op} = require('sequelize');

router.get('/', function(req, res, next) {
  const searchClause = {where: {RecordType: 'Income'}};

  // /api/income?limit=[INTEGER] to limit number of returned records.
  if (req.query.limit) {
    searchClause.limit = Number(req.query.limit);

    if (Number.isNaN(searchClause.limit)) {
      return res.status(404).json({'msg': 'wrong query'});
    }
  }

  // /api/income?dateFrom=[DATESTRING]&dateTo=[DATESTRING] to filter based on
  // dates.
  if (req.query.dateFrom && req.query.dateTo) {
    const dateFrom = new Date(req.query.dateFrom);
    const dateTo = new Date(req.query.dateTo);

    if (dateFrom == 'Invalid Date' || dateTo == 'Invalid Date') {
      return res.status(404).json({'msg': 'wrong query'});
    }

    searchClause.where.Date = {[Op.between]: [dateFrom, dateTo]};
  }

  models.Record.findAll(searchClause).then((records) => {
    if (!records) {
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
      RecordType: 'Income',
    },
  }).then((record) => {
    if (!record) {
      return res.status(404).json({msg: 'no data'});
    } else {
      return res.status(200).json(record);
    }
  });
});

router.post('/', function(req, res, next) {
  if (req.body.amount) {
    if (!req.body.date) {
      req.body.date = new Date();
    }

    models.Record.create({
      Amount: req.body.amount,
      Date: req.body.date,
      Type: req.body.type,
      Comment: req.body.comment,
      RecordType: 'Income',
      UserName: 'makos', // TODO: req.user from JWT
    }).then((record) => {
      res.status(200).json({'created': record});
    }, (err) => {
      res.status(500).json({'error': err});
    });
  } else {
    res.status(400).json({'error': 'bad request'});
  }
});

router.put('/:id', function(req, res, next) {
  models.Record.findOrCreate({
    where: {
      RecordID: req.params.id,
      RecordType: 'Income',
    },
    defaults: {
      Amount: req.body.amount,
      Date: req.body.date || new Date(),
      Type: req.body.type,
      Comment: req.body.comment,
      RecordType: 'Income',
      UserName: 'makos',
    },
  }).then(([record, created]) => {
    if (created) {
      return res.status(201).json({'created': record});
    } else {
      record.update({
        Amount: req.body.amount || record.Amount,
        Date: req.body.date || record.Date,
        Type: req.body.type || record.Type,
        Comment: req.body.comment || record.Comment,
      });
      return res.status(200).json({'updated': record});
    }
  }, (err) => {
    res.status(500).json({'error': err});
  });
});

module.exports = router;
