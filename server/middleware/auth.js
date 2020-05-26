const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No Token, authorization denied' });
  }
  try {
    const secret = config.get('jwtSecret');
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(410).json({ msg: 'Token is not valid' });
  }
};
