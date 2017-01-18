'use strict'

const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

// let devKey = 'dev'

// referenced http://cannoneyed.github.io/geojson/
// http://stackoverflow.com/questions/32754119/how-to-perform-geospatial-queries-in-mongoose
const userSchema = mongoose.Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  currentLocation: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  },
  lastLoginTime: {type: Date},
  radius: {type: Number, default: 3, required: true},
  gender: {type: String},
  age: {type: Number},
  interests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'interest'
  }],
  currentActivity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'activity'
  }
}, {timestamp: true})

userSchema.index({ location : '2dsphere' })

module.exports = mongoose.model('user', userSchema)
