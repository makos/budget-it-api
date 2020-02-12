const express = require('express');
const router = express.Router();
const auth = require('./auth_middleware');

router.post('/', auth.checkBodyPopulated, auth.loginUser);

router.use('/', function(req, res) {
  res.status(405).json({
    'Error (/login)': 'Only POST is allowed for this URL.',
  });
});

module.exports = router;
