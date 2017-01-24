'use strict'

const GeoJSON = require('mongoose-geojson-schema')
const mongoose = require('mongoose')

const ActivitySchema = mongoose.Schema({
  description: {
    type: String
  },
  interest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'interest',
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  startLocation: {
    type: mongoose.Schema.Types.Point,
    required: true
  },
  startTime: {type: Date, default: Date.now},
  endTime: {type: Date},
}, {timestamp: true})

ActivitySchema.index({ startLocation : '2dsphere' })

module.exports = mongoose.model('activity', ActivitySchema)
