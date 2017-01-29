'use strict'

module.exports = function(err, req, res, next) {
  if (err) return res.status(err.status || 500).json({msg: err.message} || {msg: 'Bad Request'}).end()
  next()
}
