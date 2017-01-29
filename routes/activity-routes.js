'use strict'

const authMiddleware = require('../lib/authMiddleware')
const Activity = require('../model/activity-model')
const User = require('../model/user-model')
const createError = require('http-errors')
const mongoose = require('mongoose')

const MILES_TO_METERS = 1609.34

module.exports = function(router) {

  router.get('/activity/search', function(req, res, next) {
    let dist = req.query.dist || 10
    let lat = req.query.lat
    let lng = req.query.lng
    let interestId = req.query.interest

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
            $maxDistance: dist * MILES_TO_METERS
          }
        }
      })
      .then(activities => {
        if(Object.keys(activities).length === 0) return next(createError(404, 'Not Found'))
        if (interestId) {
          activities = activities.filter(activity => activity.interest == interestId)
          if(Object.keys(activities).length === 0) return next(createError(404, 'Not Found'))
        }
        res.json(activities)
      })
      .catch(next)
  })

  router.post('/activity/join', authMiddleware, function(req, res, next) {
    if (Object.keys(req.body).length === 0) return next(createError(400, 'No data included in POST request'))
    Activity
    .findById(req.body.id)
    .then(activity => {
      if(Object.keys(activity).length === 0) return next(createError(404, 'Not Found'))
      activity.participants.push(req.authorizedUserId)
      activity
      .save()
      .then(activity => {
        res.json(activity)
      })
      .catch(next)
    })
    .catch(next)
  })

  router.post('/activity', authMiddleware, function(req, res, next) {
    console.log('\n\n',req.authorizedUser,'\n\n')
    if (Object.keys(req.body).length === 0) return next(createError(400, 'No data included in POST request'))
    if (mongoose.Types.ObjectId.isValid(req.authorizedUser.currentActivity)) {
      return next(createError(403, 'User already has an current activity. Please end current activity before starting new one!'))
    }
    let body = req.body
    body.host = req.authorizedUserId
    console.log(req.authorizedUserId)
    new Activity(body)
      .save()
      .then(activity => {
        User
          .findById(req.authorizedUserId)
          .then(user => {
            console.log(user)
            user.currentActivity = activity._id
            user
              .save()
              .then(() => {
                User
                .find({
                  currentLocation: {
                    $nearSphere: {
                      $geometry: activity.startLocation,
                      $minDistance: 0,
                      $maxDistance: req.authorizedUser.radius * MILES_TO_METERS
                    }
                  }
                })
                .select('-password -email -twoFactorEnabled -radius -__v -currentLocation')
                .populate('interests', 'name')
                .lean()
                .then(result => {
                  activity.set('nearbyUsers', result, { strict: false })
                  res.json(activity)
                })
                .catch(next)
              })
              .catch(next)
          })
          .catch(next)
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
