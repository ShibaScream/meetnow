'use strict'

const authMiddleware = require('../lib/authMiddleware')
const Activity = require('../model/activity-model')

const MILES_PER_DEG = 55.2428;

module.exports = function(router) {

  router.get('/activity/search', function(req, res, next) {
    let dist = req.query.dist || 10000
    let lat = req.query.lat
    let lng = req.query.lng
    // let activitiesWithin = []
    if (dist && lat != undefined && lng != undefined) {
      let coords = [lng, lat]
      Activity
      .find({
        startLocation: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: coords
            },
            $minDistance: 0,
            $maxDistance: dist
          }
        }
      })
      .then(activities => {
        // activitiesWithin = activities.filter(function(activity) {
        //   return distanceInMiles(activity.startLocation.coordinates[0], activity.startLocation.coordinates[1], lat, lng) < radius
        // })
        res.json(activities)
      })
      .catch(next)
    } else {
      next(new Error('Expected radius, lat, and lng'))
    }
  })

  router.post('/activity', authMiddleware, function(req, res, next) {
    let body = req.body;
    body.host = req.authorizedUserId
    console.log(body)
    new Activity(body)
      .save()
      .then(activity => {
        res.json(activity)
      })
      .catch(next)
  })

  router.get('/activity/:id', authMiddleware, function(req, res, next) {
    Activity
      .findById(req.params.id)
      .then(activity => {
        res.json(activity)
      })
      .catch(next)
  })

  router.put('/activity/:id', authMiddleware, function(req, res, next) {
    Activity
      .findById(req.params.id)
      .then(activity => {
        if(activity.host == req.authorizedUserId) {
          activity
            .update(req.body)
            .save()
            .then(activity => {
              res.json(activity)
            })
            .catch(next)
        }
      })
      .catch(next)
  })

  router.delete('/activity/:id', authMiddleware, function(req, res, next) {
    Activity
      .findById(req.params.id)
      .then(activity => {
        if(activity.host == req.authorizedUserId) {
          activity.remove(function(err) {
            if(err) throw err
            res.status(202)
          })
        }
      })
      .catch(next)
  })

}

function distanceInMiles(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) * MILES_PER_DEG;
}
