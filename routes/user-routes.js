'use strict'

const parseAuth = require('basic-auth')
const createError = require('http-errors')
const jsonWebToken = require('jsonwebtoken')

jsonWebToken.KEY = process.env.JSON_TOKEN_KEY || 'abcdef'
const TOKEN_EXPIRY_TIME = 60 * 60 * 24

const authMiddleware = require('../lib/authMiddleware')
const User = require('../model/user-model')

module.exports = function(router) {
  router.post('/user', function(req, res, next) {
    new User(req.body)
    .save()
    .then(user => {
      user.password = undefined
      console.log(user)
      res.json(user)
    })
    .catch(err => {
      next(createError(400, `${err.name}: ${err.message}`))
    })
  })

  router.get('/login', function(req, res, next) {
    let auth = parseAuth(req)
    console.log(auth)
    if (!auth) next(createError(403, 'Expected authorization header.'))
    User
    .findOne({ email: auth.name })
    .then(user => {
      if (user == null) return next(createError(404, 'User not found'))
      user
      .checkPass(auth.pass, (err, correct) => {
        if (err) return next(err)
        if (correct) {
          let token = jsonWebToken.sign(user, jsonWebToken.KEY, {
            expiresIn: TOKEN_EXPIRY_TIME
          })

          res.json({
            token: token,
            expiresIn: Date.now() + (TOKEN_EXPIRY_TIME * 1000)
          })
        } else
        next(createError(403, 'Invalid credentials.'))
      })
    })
    .catch(next)
  })

  router.get('/user/:userId', authMiddleware, function(req, res, next) {
    User
    .findById(req.params.userId || req.authorizedUserId)
    .populate({
      path: 'interests',
      model: 'interest',
      populate: {
        path: 'category',
        model: 'category'
      }
    })
    .then(user => {
      user.password = undefined
      user.email = undefined
      user.radius = undefined
      //possibly make gender and other personal details optional to return
      res.json(user)
    })
    .catch(next)
  })

  router.get('/user/search', authMiddleware, function(req, res, next) {
    let lat = req.query.lat
    let lng = req.query.lng
    let interestId = req.query.interest
    if (!lat || !lng)
      return next(new Error('Expected lattitude and longitude.'))
    User.find({ currentLocation: {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $minDistance: 0,
        $maxDistance: req.authorizedUser.radius
      }
    }}).then(activities => {
      if (interestId)
        activities = activities.filter(activity => activity.interest == interestId)
      res.json(activities)
    })
    .catch(next)
  })

  router.put('/user', authMiddleware, function(req, res, next) { //TODO add pre 'update' function to schema to hash password if password was updated
    User
    .findByIdAndUpdate(req.authorizedUserId, { new: true }, req.body)
    .then(function(err, user) {
      if (err) return next(err)
      delete user.password
      res.json(user)
    })
    .catch(next)
  })

  router.delete('/user/:userId', authMiddleware, function(req, res, next) {
    User
    .findByIdAndRemove(req.params.userId)
    .then(function(err) {
      if (err) return next(err)
      res.status(202)
      res.end()
    })
    .catch(next)
  })
}
