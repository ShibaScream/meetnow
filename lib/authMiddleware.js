'use strict'
const jsonWebToken = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = function(req, res, next) {
  var token = req.headers['authorization']

  if (token) {
    jsonWebToken.verify(token.substr(7), jsonWebToken.KEY, function(err, user) {
      if (err) throw err
      req.authorizedUser = user
      req.authorizedUserId = user._id
      next()
    })
  } else {
    return next(createError(403, 'No token provided'))
  }
};
