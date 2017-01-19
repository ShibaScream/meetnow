'use strict'

const mongoose = require('mongoose')

const ActivitySchema = mongoose.Schema({
  interest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'interest'
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  startLocation: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  },
  startTime: {type: Date, required: true},
  endTime: {type: Date},
}, {timestamp: true})

ActivitySchema.index({ location : '2dsphere' })

module.exports = mongoose.model('activity', ActivitySchema)
