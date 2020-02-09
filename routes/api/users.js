const express = require('express');
const router = express.Router();
const models = require('../../models');

router.get('/', function(req, res, next) {
  models.User.findAll().then((users) => {
    return res.status(200).json(users);
  });
});

router.get('/:name', function(req, res, next) {
  models.User.findOne({
    where: { Name: req.params.name },
    attributes: [ 'ID', 'Name' ],
    include: [ models.Record ],
  }).then((user) => {
    return res.status(200).json(user);
  });
});

module.exports = router;
