'use strict'

const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

// let devKey = 'dev'

// referenced http://cannoneyed.github.io/geojson/
// http://stackoverflow.com/questions/32754119/how-to-perform-geospatial-queries-in-mongoose
const UserSchema = mongoose.Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  currentLocation: {
    type: { type: String, default: 'Point'},
    coordinates: [Number]
  },
  lastLoginTime: {type: Date},
  radius: {type: Number, default: 3, required: true},
  gender: {
    type: String,
    validate: function(gender) {
      const genderList = ['male', 'female', 'non-binary / third gender', 'prefer not to say']
      return genderList.includes(gender.toLowerCase())
    }
  },
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

UserSchema.index({ location : '2dsphere' })

module.exports = mongoose.model('user', UserSchema)
