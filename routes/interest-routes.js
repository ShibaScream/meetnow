'use strict'

const authMiddleware = require('../lib/authMiddleware')
const Interest = require('../model/interest-model')
const createError = require('http-errors')

module.exports = function(router) {
  router.post('/interest', authMiddleware, function(req, res, next) {
    if (Object.keys(req.body).length === 0) return next(createError(400, 'No data included in POST request'))
    new Interest(req.body)
      .save()
      .then(function(interest) {
        res.json(interest)
      })
      .catch(next)
  })

  router.get('/interests', function(req, res, next) {
    Interest
      .find({})
      .populate('category')
      .then(interests => {
        res.json(interests)
      })
      .catch(next)
  })

  router.get('/interest/:id', function(req, res, next) {
    if (!req.params.id) return next(createError(400, 'No activity id'))
    Interest
      .findById(req.params.id)
      .populate('category')
      .then(function(interest) {
        if (interest == null) return next(createError(404, 'Interest not found'))
        res.json(interest)
      })
      .catch(next)
  })

  router.delete('/interest/:id', authMiddleware, function(req, res, next) {
    if (!req.params.id) return next(createError(400, 'No activity id'))
    Interest
      .findByIdAndRemove(req.params.id)
      .then(function() {
        res.status(202).end()
      })
      .catch(next)
  })
}
