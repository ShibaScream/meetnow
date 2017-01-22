'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
// const jwt = require('jsonwebtoken')

// let devKey = 'dev'

// referenced http://cannoneyed.github.io/geojson/
// http://stackoverflow.com/questions/32754119/how-to-perform-geospatial-queries-in-mongoose
const UserSchema = mongoose.Schema({
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

UserSchema.pre('save', function(next) {
  if (!this.isModified('password'))
    return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});

UserSchema.methods.checkPass = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, matches) {
    if (err) return callback(err);
    callback(null, matches);
  });
};

module.exports = mongoose.model('user', UserSchema)
