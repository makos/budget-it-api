const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const models = require('../models');

router.post('/', function(req, res, next) {
  if (req.body.username && req.body.password) {
    models.User.findByPk(req.body.username).then((user) => {
      if (user) {
        res.status(400).json({
          'Error': `User ${req.body.username} already exists.`
        });
      } else {
        // TODO: Split this out into middleware.
        bcrypt.genSalt(16, function(err, salt) {
          bcrypt.hash(req.body.password, salt, function(err, hash) {
            if (err) {
              return res.status(500).json({'Error': err});
            } else {
              models.User.create({
                Name: req.body.username,
                Password: hash,
              }).then((user) => {
                return res.status(200).json({'Created': user});
              });
            }
          });
        });
      }
    });
  } else {
    res.status(400).json({'error': 'bad query'});
  }
});

module.exports = router;
