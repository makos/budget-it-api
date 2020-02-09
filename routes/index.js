const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  return res.status(404).json({'msg': 'no data'});
});

module.exports = router;
