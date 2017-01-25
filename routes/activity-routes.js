'use strict'

const authMiddleware = require('../lib/authMiddleware')
const Activity = require('../model/activity-model')
const createError = require('http-errors')

// const MILES_PER_DEG = 55.2428;

module.exports = function(router) {

  router.get('/activity/search', function(req, res, next) {
    let dist = req.query.dist || 10000
    let lat = req.query.lat
    let lng = req.query.lng
    let interestId = req.query.interest;
    // let activitiesWithin = []

    if (lat == undefined || lng == undefined) {
      return next(createError(400, 'Must include latitude and longitude'))
    }

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
        if (interestId) {
          activities = activities.filter(activity => activity.interest == interestId);

        }

        if(Object.keys(activities).length === 0) return next(createError(404, 'Not Found'))

        res.json(activities)
      })
      .catch(next)
  })

  router.post('/activity', authMiddleware, function(req, res, next) {
    if (Object.keys(req.body).length === 0) return next(createError(400, 'No data included in POST request'))
    let body = req.body
    body.host = req.authorizedUserId
    // console.log(body)
    new Activity(body)
      .save()
      .then(activity => {
        res.json(activity)
      })
      .catch(next)
  })

  router.get('/activity/:id', authMiddleware, function(req, res, next) {
    if (!req.params.id) return next(createError(400, 'No activity id'))
    Activity
      .findById(req.params.id)
      .then(activity => {
        if(Object.keys(activity).length === 0) return next(createError(404, 'Not Found'))
        res.json(activity)
      })
      .catch(next)
  })

  router.put('/activity/:id', authMiddleware, function(req, res, next) {
    if (Object.keys(req.body).length === 0) return next(createError(400, 'No data included in PUT request'))
    Activity
      .findById(req.params.id)
      .then(activity => {
        if (activity == null) {
          return next(createError(404, 'Activity not found'))
        }

        if(activity.host.equals(req.authorizedUserId)) {
          activity
            .update(req.body)
            .save()
            .then(activity => {
              res.json(activity)
            })
            .catch(next)
        } else {
          next(createError(401, 'Not authorized'))
        }
      })
      .catch(next)
  })

  router.delete('/activity/:id', authMiddleware, function(req, res, next) {
    if (!req.params.id) return next(createError(400, 'No activity id'))
    Activity
      .findById(req.params.id)
      .then(activity => {
        if (activity == null) {
          return next(createError(404, 'Activity not found'))
        }
        if(activity.host.equals(req.authorizedUserId)) {
          activity.remove(function(err) {
            if(err) return next(createError(404, err.message))
            res.status(202).end()
          })
        } else {
          next(createError(401, 'Not authorized'))
        }
      })
      .catch(next)
  })

}

// function distanceInMiles(x1, y1, x2, y2) {
//   return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) * MILES_PER_DEG;
// }
