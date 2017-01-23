'use strict'
const jsonWebToken = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = function(req, res, next) {
  var token = req.headers['authorization']

  if (token) {
    jsonWebToken.verify(token.substr(7), jsonWebToken.KEY, function(err, user) {
      if (err) throw err
      req.authorizedUser = user._doc
      req.authorizedUserId = user._doc._id
      console.log('AuthorizedUser', user)
      next()
    })
  } else {
    return next(createError(403, 'No token provided'))
  }
};
