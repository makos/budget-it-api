const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const models = require('../models');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const auth = require('./auth_middleware');

router.post('/', auth.checkBodyPopulated, auth.loginUser);

module.exports = router;
