'use strict'

const mongoose = require('mongoose')

const InterestSchema = mongoose.Schema({
  name: {type: String, unique: true, required: true},
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
})

module.exports = mongoose.model('interest', InterestSchema)
