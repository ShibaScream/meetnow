'use strict'

const User = require('../model/user-model')
// const GeoJSON = require('mongoose-geojson-schema')

module.exports.seedUsers = function (interests) {
  let users = [
    {
      // lives in Seattle
      name: 'Runs More',
      password: '1234pass',
      email: 'runs.more@test.com',
      currentLocation: {
        type: 'Point',
        coordinates: [122.3321, 47.6062]
      },
      radius: 10,
      gender: 'male',
      age: 25,
      interests: ['Run', 'Hike', 'Dance Performance']

    },
    {
      // uses default radius, lives in Ballard
      name: 'Sees Lots',
      password: '1235pass',
      email: 'sees.lots@test.com',
      currentLocation: {
        type: 'Point',
        coordinates: [122.3860, 47.6792]
      },
      gender: 'female',
      age: 30,
      interests: ['Run', 'Dance Performance', 'Indie Rock', 'Wine Tasting']
    },
    {
      // lives in Spokane
      name: 'Far Away',
      password: '1236pass',
      email: 'far.away@test.com',
      currentLocation: {
        type: 'Point',
        coordinates: [117.4260, 47.6588]
      },
      radius: 30,
      gender: 'male',
      age: 27,
      interests: ['Run', 'Indie Rock', 'Cooking Class', 'Beer Festival']
    }
  ]

  users.forEach(user => {
    user.interests = user.interests.map(interest => {
      return interests[interests.findIndex(_findInterestName, interest)]._id
    })
  })

  return new Promise ( (resolve, reject) => {
    User
      .remove({})
      .then(() => {
        users.forEach(user => {
          User
            .create(user)
            .then(createdUser => {
              createdUser.interests.forEach(interest => {
                interests[interests.findIndex(_findInterestID, interest)].users.addToSet(createdUser._id)
              })
              interests.forEach(i => i.save().catch(err => console.error(err)))
              resolve(createdUser)
            })
            .catch(reject)
        })
      })
      .catch(reject)
  })

  function _findInterestName (interest) {
    return interest.name === this
  }

  function _findInterestID (interest) {
    return interest._id.equals(this)
  }
}
