const authMiddleware = require('../lib/authMiddleware')
const Activity = require('../model/activity-model')

module.exports = function(router) {
  router.post('/activity', authMiddleware, function(req, res, next) {
    let body = req.body;
    body.host = req.authorizedUserId
    new Activity(body).save().then(function(err, activity) {
      if(err) throw err
      res.json(activity)
    }).catch(next)
  })
  router.get('/activity/:id', function(req, res, next) {
    Activity.findById(req.params.id).then(function(err, activity) {
      if (err) throw err
      res.json(activity)
    }).catch(next)
  })
  router.put('/activity/:id', authMiddleware, function(req, res, next) {
    Activity.findById(req.params.id).then(function(err, activity) {
      if(err) throw err
      if(activity.host == req.authorizedUserId) {
        activity.update(req.body).save().then(function(err, activity) {
          if(err) throw err
          res.json(activity)
        }).catch(next)
      }
    }).catch(next)
  })
  router.delete('/activity/:id', authMiddleware, function(req, res, next) {
    Activity.findById(req.params.id).then(function(err, activity) {
      if(err) throw err
      if(activity.host == req.authorizedUserId) {
        activity.remove(function(err) {
          if(err) throw err
          res.status(202)
        })
      }
    }).catch(next)
  })
}
