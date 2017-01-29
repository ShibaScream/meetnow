'use strict'

const Activity = require('../model/activity-model')

module.exports.seedActivities = function(users) {
  let activities = [
    {
      description: 'testOne',
      interest: 'Run',
      host: 'Far Away',
      startLocation: 'user currentLocationt location'
    },
    {
      description: 'testTwo',
      interest: 'Run',
      host: 'Runs More',
      startLocation: 'user currentLocationt location'
    },
    {
      description: 'testThree',
      interest: 'Run',
      host: 'Sees Lots',
      startLocation: 'user currentLocationt location'
    }
  ]

  activities = activities.map(activity => {
    let host = users.findIndex(_findHostName, activity.host)
    activity.host = users[users.findIndex(_findHostName, activity.host)]._id
    activity.interest = users[host].interests[0]
    activity.startLocation = users[host].currentLocation
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

  function _findHostName(users){
    return users.name === this
  }
}
