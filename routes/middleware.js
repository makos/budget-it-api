const {Op} = require('sequelize');
const models = require('../models');

const setRecordType = function(req, res, next) {
  req.searchClause = {};
  if (req.baseUrl == '/api/income') {
    req.searchClause.where = {RecordType: 'Income'};
  } else if (req.baseUrl == '/api/expenses') {
    req.searchClause.where = {RecordType: 'Expense'};
  }

  next();
};

const setUser = function(req, res, next) {
  req.searchClause.where.UserName = req.user;
  next();
};

// /api/[income,expenses]?limit=INTEGER to limit number of returned records.
const setLimit = function(req, res, next) {
  if (req.query.limit) {
    if (isNaN(Number(req.query.limit))) {
      return res.status(400).json({
        'Error': '?limit= query should be an integer, e.g. ?limit=2',
      });
    } else {
      req.searchClause.limit = Number(req.query.limit);
    }
  }

  next();
};

// /api/[income,expenses]?dateFrom=DATESTRING&dateTo=DATESTRING to filter
// based on dates.
const setDateRange = function(req, res, next) {
  if (req.query.dateFrom && req.query.dateTo) {
    const dateFrom = new Date(req.query.dateFrom);
    const dateTo = new Date(req.query.dateTo);

    if (dateFrom == 'Invalid Date' || dateTo == 'Invalid Date') {
      return res.status(400).json({
        'Error': '?date[From,To]= accepts a valid ISO date string, in format' +
        ' YYYY-MM-DD',
      });
    }

    req.searchClause.where.Date = {[Op.between]: [dateFrom, dateTo]};
  }

  next();
};

const getAllRecords = function(req, res) {
  models.Record.findAll(req.searchClause).then((records) => {
    if (!records) {
      return res.status(404).json({'Error': 'No data in database.'});
    } else {
      return res.status(200).json(records);
    }
  });
};

const getOneRecord = function(req, res) {
  models.Record.findOne(req.searchClause).then((record) => {
    if (!record) {
      return res.status(404).json({
        'Error': `Record ID ${req.searchClause.where.RecordID} doesn't exist.`,
      });
    } else {
      return res.status(200).json(record);
    }
  });
};

const setId = function(req, res, next) {
  if (req.params.id) {
    if (isNaN(Number(req.params.id))) {
      return res.status(400).json({
        'Error': `${req.params.id} is not a valid number.`,
      });
    } else {
      req.searchClause.where.RecordID = Number(req.params.id);
    }
  }
  next();
};

const postRecord = function(req, res) {
  if (req.body.amount) {
    if (!req.body.date) {
      req.body.date = new Date();
    }

    models.Record.create({
      Amount: req.body.amount,
      Date: req.body.date,
      Type: req.body.type,
      Comment: req.body.comment,
      RecordType: req.searchClause.where.RecordType,
      UserName: req.user,
    }).then((record) => {
      res.status(200).json({'Created': record});
    }, (err) => {
      res.status(500).json({'Error': err});
    });
  } else {
    res.status(400).json({
      'Error': 'Bad request: missing Amount (decimal number) field.',
    });
  }
};

// setId() must be called before this middleware.
const deleteRecord = function(req, res) {
  models.Record.findOne(req.searchClause).then((record) => {
    if (record) {
      record.destroy();
      return res.status(200).json({'Deleted': record});
    } else {
      return res.status(400).json({
        'Error': `Record with ID ${req.searchClause.where.RecordID} not found.`,
      });
    }
  }, (err) => {
    return res.status(500).json({'Error': err});
  });
};

const putRecord = function(req, res) {
  models.Record.findOne(req.searchClause).then((record) => {
    if (record) {
      record.update({
        Amount: req.body.amount || record.Amount,
        Date: req.body.date || record.Date,
        Type: req.body.type || record.Type,
        Comment: req.body.comment || record.Comment,
      }).then(() => {
        return res.status(200).json({'Updated': record});
      });
    } else {
      return res.status(404).json({
        'Error': `Record with ID ${req.params.id} not found.`,
      });
    }
  }, (err) => {
    return res.status(500).json({'Error': err});
  });
};

module.exports = {
  setRecordType,
  setLimit,
  setDateRange,
  getAllRecords,
  setId,
  getOneRecord,
  postRecord,
  deleteRecord,
  putRecord,
  setUser,
};
