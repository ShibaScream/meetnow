'use strict'

const mongoose = require('mongoose')

const interestSchema = mongoose.Schema({
  name: {type: String, required: true},
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'interest'
  }
})

module.exports = mongoose.model('interest', interestSchema)
