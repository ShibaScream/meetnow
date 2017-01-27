'use strict'

const Activity = require('../model/activity-model')

module.exports.seedActivities = function(users) {
  console.log(users)
  let activities = [
    {
      description: 'test',
      interest: 'Run',
      host: 'user objectId',
      startLocation: 'user currnet location'
    }
  ]

  activities = activities.map(activity => {
    activity.interest = users.interests[0]
    // activity.host = users[users.name.findIndex(_findHostName, activity.host)]._id
    // activity.interest = users.interests.findIndex(_findInterestName, activity.interest)._id
    activity.host = users._id
    activity.startLocation = users.currentLocation
    console.log(activity)
    return activity
  })

  return new Promise(( resolve, reject) => {
    Activity.remove({})
    .then(() => {
      Activity.insertMany(activities)
      .then(resolve)
      .catch(reject)
    })
    .catch(reject)
  })

  // function _findHostName(users){
  //   console.log(users.name)
  //   return users.name === this
  // }

  // function _findInterestName(interest) {
  //   console.log(interest.name)
  //   return interest.name === this
  // }
}