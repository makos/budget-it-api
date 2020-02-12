const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

router.post('/', function(req, res, next) {
  if (req.body.username && req.body.password) {
    models.User.findByPk(req.body.username).then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.Password, function(err, login) {
          if (login) {
            // TODO: Expire the token in a week or something like that.
            // Refresh it every time user passes a token check on other routes.
            const token = jwt.sign({loggedInAs: user.Name}, config.secret);
            return res.status(200).json(token);
          } else {
            return res.status(400).json({'Error': 'Wrong username or password.'});
          }
        })
      }
    })
  } else {
    res.status(400).json({'error': 'bad query'});
  }
});

module.exports = router;
