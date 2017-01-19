'use strict'

const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
  category: {
    type: String,
    unique: true
  },
  interests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'interest'
  }]
})

module.exports = mongoose.model('category', CategorySchema)
