'use strict'

const jsonWebToken = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = function(req, res, next) {
  var token = req.headers['authorization']

  if (token) {
    jsonWebToken.verify(token.substr(7), jsonWebToken.KEY, function(err, user) {
      if (err) return next(createError(401, `${err.name}: ${err.message}`))
      debugger
      req.authorizedUser = user._doc
      req.authorizedUserId = user._doc._id
      next()
    })
  } else {
    return next(createError(401, 'No token provided'))
  }
}
