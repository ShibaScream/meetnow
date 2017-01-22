'use strict'

const User = require('../model/user-model')

module.exports.seedUsers = function (interests) {
  let users = [
    {
      // lives in Seattle
      name: 'Runs More',
      password: '1234pass',
      email: 'runs.more@test.com',
      currentLocation: [122.3321, 47.6062],
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
      currentLocation: [122.3860, 47.6792],
      gender: 'female',
      age: 30,
      interests: ['Run', 'Dance Performance', 'Indie Rock', 'Wine Tasting']
    },
    {
      // lives in Spokane
      name: 'Far Away',
      password: '1236pass',
      email: 'far.away@test.com',
      currentLocation: [117.4260, 47.6588],
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
        User
          .insertMany(users)
          .then(createdUsers => {
            createdUsers.forEach(user => {
              user.interests.forEach(interest => {
                interests[interests.findIndex(_findInterestID, interest)].users.push(user._id)
              })
            })
            interests.forEach(interest => {
              interest
                .save()
                .catch(err => console.error(err))
            })
            resolve(createdUsers)
          })
          .catch(reject)
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
