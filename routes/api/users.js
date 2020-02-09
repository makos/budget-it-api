const express = require('express');
const router = express.Router();
const models = require('../../models');

router.get('/', function(req, res, next) {
  models.User.findAll().then((users) => {
    return res.status(200).json(users);
  });
});

router.get('/:id', function(req, res, next) {
  models.User.findByPk(req.params.id, {
    include: [{ model: models.Record, as: 'Records' }],
  }).then((user) => {
    return res.status(200).json(user);
  });
});

module.exports = router;
