'use strict'

const Interest = require('../model/interest-model.js')

module.exports.seedInterests = function (categories) {
  let interests = [
    {
      name: 'Run',
      category: 'Active'
    },
    {
      name: 'Walk',
      category: 'Active'
    },
    {
      name: 'Hike',
      category: 'Active'
    },
    {
      name: 'Game Night',
      category: 'Party'
    },
    {
      name: 'Pub Crawl',
      category: 'Party'
    },
    {
      name: 'Karaoke',
      category: 'Party'
    },
    {
      name: 'Dance Performance',
      category: 'Art'
    },
    {
      name: 'Theatre',
      category: 'Art'
    },
    {
      name: 'Art Exhibit',
      category: 'Art'
    },
    {
      name: 'Electronic',
      category: 'Music'
    },
    {
      name: 'Indie Rock',
      category: 'Music'
    },
    {
      name: 'Folk',
      category: 'Music'
    },
    {
      name: 'Jazz',
      category: 'Music'
    },
    {
      name: 'Beer Festival',
      category: 'Food'
    },
    {
      name: 'Wine Tasting',
      category: 'Food'
    },
    {
      name: 'Cooking Class',
      category: 'Food'
    }
  ]

  interests = interests.map(interest => {
    interest.category = categories[categories.findIndex(_findCategoryName, interest)]._id
    return interest
  })

  return new Promise( (resolve, reject) => {
    Interest
      .remove({})
      .then(() => {
        Interest
          .insertMany(interests)
          .then(createdInterests => {
            createdInterests.forEach(interest => {
              // find category associated with interest and push interest id into category's interests array
              categories[categories.findIndex(_findCategoryId, interest)].interests.push(interest._id)
            })
            categories.forEach(category => {
              category
                .save()
                .catch(err => console.error(err))
            })
            resolve(createdInterests)
          })
          .catch(reject)
      })
    .catch(reject)
  })


  function _findCategoryName (cat) {
    return cat.category === this.category
  }

  function _findCategoryId (cat) {
    return cat._id.equals(this.category)
  }
}
