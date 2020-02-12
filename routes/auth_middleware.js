const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

const authJWT = function (req, res, next) {
  const header = req.get('authorization');
  if (header) {
    const token = header.split(' ')[1];

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({'Error': 'Forbidden'});
      } else {
        req.user = decoded.name;
        next();
      }
    });
  } else {
    res.status(401).json({'Error': 'Unauthorized'});
  }
}

module.exports = {
  authJWT,
}
