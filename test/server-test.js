// 'use strict'
//
// const mongoose = require('mongoose')
//
// mongoose.Promise = global.Promise
//
// before((done) => {
//   mongoose.connect('mongodb://localhost/meetnow')
//   mongoose.connection
//     .once('open', () => { done() })
//     .on('error', (error) => {
//       console.warn('Warning', error)
//     })
// })
//
// beforeEach((done) => {
//   const { users, interests } = mongoose.connection.collections
//   users.drop(() => {
//     interests.drop(() => {
//       done()
//     })
//   })
// })
