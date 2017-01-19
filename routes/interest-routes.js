'use strict'

const authMiddleware = require('../lib/authMiddleware');
const Interest = require('../model/interests-model');

module.exports = function(router) {
  router.post('/interest', authMiddleware, function(req, res, next) {
    new Interest(req.body).save().then(function(interest) {
      res.json(interest);
    }).catch(next);
  });

  router.get('/interests', function(req, res, next) {
    Interest.find({}).then(function(err, categories) {
      res.json(categories.map((interest) => interest._id));
    }).catch(next);
  });

  router.get('/interest/:id', function(req, res, next) {
    Interest.findById(req.params.id).then(function(interest) {
      res.json(interest);
    }).catch(next);
  });

  router.delete('/interest/:id', authMiddleware, function(req, res, next) {
    Interest.findByIdAndRemove(req.params.id).then(function() {
      res.status(202);
    }).catch(next);
  });
};
