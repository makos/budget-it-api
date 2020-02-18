const express = require('express');
const router = express.Router();
const m = require('../../utils/api_middleware');
const auth = require('../../utils/auth_middleware');

router.use(auth.checkToken, m.setRecordType, m.setUser);

router.get('/', m.setOffset, m.setLimit, m.setDateRange, m.getAllRecords);

router.get('/:id', m.setId, m.getOneRecord);

router.post('/', m.postRecord);

router.put('/:id', m.setId, m.putRecord);

router.delete('/:id', m.setId, m.deleteRecord);

module.exports = router;
