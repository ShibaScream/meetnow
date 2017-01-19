'use strict'

const authMiddleware = require('../lib/authMiddleware');
const Category = require('../model/category-model');

module.exports = function(router) {
  router.post('/category', authMiddleware, function(req, res, next) {
    new Category(req.body).save().then(function(category) {
      res.json(category);
    }).catch(next);
  });

  router.get('/categories', function(req, res, next) {
    Category.find({}).then(function(err, categories) {
      res.json(categories.map((category) => category._id));
    }).catch(next);
  });

  router.get('/category/:id', function(req, res, next) {
    Category.findById(req.params.id).then(function(category) {
      res.json(category);
    }).catch(next);
  });

  router.delete('/category/:id', authMiddleware, function(req, res, next) {
    Category.findByIdAndRemove(req.params.id).then(function() {
      res.status(202);
    }).catch(next);
  });
};
