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
  if (req.user) {
    req.searchClause.where.UserName = req.user;
    next();
  } else {
    return res.status(401).json({'Error (setUser)': 'Unauthorized'});
  }
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
  return models.Record.findAll(req.searchClause).then((records) => {
    return res.status(200).json(records);
  }, (err) => {
    return res.status(500).json(err);
  });
};

const getOneRecord = function(req, res) {
  return models.Record.findOne(req.searchClause).then((record) => {
    return res.status(200).json(record);
  }, (err) => {
    return res.status(500).json(err);
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
    } else {
      // TODO: unit test in api_middleware.test.js.
      req.body.date = new Date(req.body.date);
      if (req.body.date == 'Invalid Date') {
        return res.status(400).json({'Error': 'Bad date string passed.'});
      }
    }

    req.body.date = req.body.date.toISOString();

    return models.Record.create({
      Amount: req.body.amount,
      Date: req.body.date,
      Type: req.body.type,
      Comment: req.body.comment,
      RecordType: req.searchClause.where.RecordType,
      UserName: req.user,
    }).then((record) => {
      return res.status(200).json({'Created': record});
    }, (err) => {
      return res.status(500).json(err);
    });
  } else {
    return res.status(400).json({
      'Error': 'Bad request: missing Amount (decimal number) field.',
    });
  }
};

// setId() must be called before this middleware.
const deleteRecord = function(req, res) {
  return models.Record.findOne(req.searchClause).then((record) => {
    if (record) {
      record.destroy();
      return res.status(200).json({'Deleted': record});
    } else {
      // TODO: test this branch in api_middelware.test.js.
      return res.status(404).json({
        'Error': `Record with ID ${req.searchClause.where.RecordID} not found.`,
      });
    }
  }, (err) => {
    return res.status(500).json(err);
  });
};

const putRecord = function(req, res) {
  return models.Record.findOne(req.searchClause).then((record) => {
    return record.update({
      Amount: req.body.amount || record.Amount,
      Date: req.body.date || record.Date,
      Type: req.body.type || record.Type,
      Comment: req.body.comment || record.Comment,
    }).then(() => {
      return res.status(200).json({'Updated': record});
    });
  }, (err) => {
    return res.status(500).json(err);
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
