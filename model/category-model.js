'use strict'

const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  category: {
    type: String,
    unique: true
  },
  interests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'interest'
  }]
})

module.exports = mongoose.model('user', categorySchema)
