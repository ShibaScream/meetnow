'use strict'

const authMiddleware = require('../lib/authMiddleware')
const Category = require('../model/category-model')
const createError = require('http-errors')

module.exports = function(router) {
  router.post('/category', authMiddleware, function(req, res, next) {
    if (Object.keys(req.body).length === 0) return next(createError(400, 'No data included in POST request'))
    new Category(req.body)
      .save()
      .then(function(category) {
        res.json(category)
      })
      .catch(next)
  })

  router.get('/categories', function(req, res, next) {
    Category
      .find({})
      .populate('interests')
      .then(function(categories) {
        res.json(categories)
      })
      .catch(next)
  })

  router.get('/category/:id', function(req, res, next) {
    Category
      .findById(req.params.id)
      .then(function(category) {
        if (category == null) return next(createError(404, 'Interest not found'))
        res.json(category)
      })
      .catch(next)
  })

  router.delete('/category/:id', authMiddleware, function(req, res, next) {
    Category
      .findByIdAndRemove(req.params.id)
      .then(function() {
        res.status(202).end()
      })
      .catch(next)
  })
}
