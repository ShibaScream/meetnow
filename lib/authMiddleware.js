'use strict'
const jsonWebToken = require('jsonwebtoken');

module.exports = function(req, res, next) {
  var token = req.headers['Authorization'];

  if (token) {
    jsonWebToken.verify(token.substr(7), jsonWebToken.KEY, function(err, user) {
      if (err) throw err;
      req.authorizedUser = user;
      req.authorizedUserId = user._id;
      next();
    });
  } else {
    return res.status(403).send('No token provided.');
  }
};
