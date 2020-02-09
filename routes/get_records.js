var models = require('../models');

module.exports = function(req, res, next) {
    models.Record.findAll({ limit: req.limitNumber }).then(records => {
        if (records == null) {
            return res.status(404).json({ "msg": "no data" });
        } else {
            return res.status(200).json(records);
        }
    });
}
