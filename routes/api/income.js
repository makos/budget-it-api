const express = require('express');
const router = express.Router();
const models = require('../../models');
const m = require('../middleware');

router.get('/', m.setRecordType, m.setLimit, m.setDateRange, m.getAllRecords);

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

router.delete('/:id', function(req, res, next) {
  models.Record.findByPk(req.params.id).then((record) => {
    if (record) {
      record.destroy();
      return res.status(200).json({'deleted': record});
    } else {
      return res.status(400).json({'error': 'bad id'});
    }
  }, (err) => {
    return res.status(500).json({'error': err});
  });
});

module.exports = router;
