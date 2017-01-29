'use strict'

const categorySeeds = require('./categorySeeds')
const interestSeeds = require('./interestSeeds')
const userSeeds = require('./userSeeds')
const activitySeeds = require('./activitySeeds')

module.exports = function () {
  return new Promise((resolve, reject) => {
    categorySeeds
    .seedCategories()
    .then(categories => {
      interestSeeds
      .seedInterests(categories)
      .then(interests => {
        userSeeds
        .seedUsers(interests)
        .then(users => {
          activitySeeds
          .seedActivities(users)
          .then(() => {
            resolve()
          })
          .catch(reject)
        })
        .catch(reject)
      })
      .catch(reject)
    })
    .catch(reject)
  })
}
