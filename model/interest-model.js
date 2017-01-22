'use strict'

const mongoose = require('mongoose')

const InterestSchema = mongoose.Schema({
  name: {type: String, required: true},
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
})

module.exports = mongoose.model('interest', InterestSchema)
