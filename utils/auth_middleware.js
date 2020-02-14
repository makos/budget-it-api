const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const models = require('../models');

const checkToken = function(req, res, next) {
  const header = req.get('authorization');
  if (header) {
    const token = header.split(' ')[1];

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({'Error': 'Forbidden'});
      } else {
        req.user = decoded.loggedInAs;
        next();
      }
    });
  } else {
    res.status(401).json({'Error': 'Unauthorized'});
  }
};

const checkBodyPopulated = function(req, res, next) {
  if (req.body.username && req.body.password) {
    next();
  } else {
    res.status(400).json({'Error': 'No username or password specified.'});
  }
};

const checkPassword = function(req, res, next) {
  if (req.body.password.length < 8) {
    return res.status(400).json({
      'Error': 'Password must be at least 8 characters long.',
    });
  }
  next();
};

const checkIfUserExists = function(req, res, next) {
  return models.User.findByPk(req.body.username).then((user) => {
    if (user) {
      res.status(400).json({
        'Error': `User ${req.body.username} already exists.`,
      });
    } else {
      next();
    }
  });
};

const hashPassword = function(req, res, next) {
  bcrypt.genSalt(16, function(err, salt) {
    bcrypt.hash(req.body.passwrod, salt, function(err, hash) {
      if (err) {
        return res.status(400).json(err);
      } else {
        req.passwordHash = hash;
        next();
      };
    });
  });
};

const createNewUser = function(req, res) {
  return models.User.create({
    Name: req.body.username,
    Password: req.passwordHash,
  }).then((user) => {
    return res.status(200).json({'Created': user});
  }, (err) => {
    return res.status(500).json(err);
  });
};

const loginUser = function(req, res, next) {
  models.User.findByPk(req.body.username).then((user) => {
    if (user) {
      bcrypt.compare(req.body.password, user.Password, function(err, login) {
        if (login) {
          const token = jwt.sign({loggedInAs: user.Name}, config.secret, {
            expiresIn: config.jwtExp,
          });
          return res.status(200).json(token);
        } else {
          return res.status(400).json({'Error': 'Wrong username or password.'});
        }
      });
    }
  });
};

module.exports = {
  checkToken,
  checkBodyPopulated,
  checkIfUserExists,
  checkPassword,
  createNewUser,
  loginUser,
  hashPassword,
};
