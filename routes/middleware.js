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

// /api/[income,expenses]?limit=INTEGER to limit number of returned records.
const setLimit = function(req, res, next) {
  if (req.query.limit) {
    req.searchClause.limit = Number(req.query.limit);

    if (Number.isNaN(req.searchClause.limit)) {
      return res.status(404).json({'msg': 'wrong query'});
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
      return res.status(404).json({'msg': 'wrong query'});
    }

    req.searchClause.where.Date = {[Op.between]: [dateFrom, dateTo]};
  }

  next();
};

const getAllRecords = function(req, res) {
  models.Record.findAll(req.searchClause).then((records) => {
    if (!records) {
      return res.status(404).json({msg: 'no data'});
    } else {
      return res.status(200).json(records);
    }
  });
};

const getOneRecord = function(req, res) {
  models.Record.findOne(req.searchClause).then((record) => {
    if (!record) {
      return res.status(404).json({msg: 'no data'});
    } else {
      return res.status(200).json(record);
    }
  });
};

const setId = function(req, res, next) {
  if (req.params.id) {
    if (isNaN(Number(req.params.id))) {
      return res.status(400).json({'error': 'bad query'});
    } else {
      req.searchClause.where.RecordID = req.params.id;
    }
  } else {
    return res.status(400).json({'error': 'bad query'});
  }
  next();
};

module.exports = {
  setRecordType,
  setLimit,
  setDateRange,
  getAllRecords,
  setId,
  getOneRecord,
};
