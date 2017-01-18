const authMiddleware = require('../lib/authMiddleware')
const Activity = require('../model/activity-model')

module.exports = function(router) {
  router.post('/activity', function(req, res, next) {
    new Activity(req.body).save().then(function(err, activity) {
      if(err) throw(err)
      res.json(activity)
    }).catch(next)
  })
  router.get('/activity/:id', function(req, res, next) {
    Activity.findById(req.params.id).then(function(err, activity) {
      if (err) throw err
      res.json(activity)
    }).catch(next)
  })
  router.put('/activity/:id', function(req, res, next) {
    Activity.findByIdAndUpdate(req.params.id, {new: true}, req.body).then(function(err, activity) {
      if(err) throw err
      res.json(activity)
    }).catch(next)
  })
  router.delete('/activity/:id', function(req, res, next) {
    Activity.findByIdAndRemove(req.params.id).then(function(err) {
      if(err) throw err
      res.status(202)
    }).catch(next)
  })
}
