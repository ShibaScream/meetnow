'use strict'

const Category = require('../model/category-model')

module.exports.seedCategories = function() {
  const categories = [
    {category: 'Active'},
    {category: 'Art'},
    {category: 'Food'},
    {category: 'Music'},
    {category: 'Party'}
  ]

  return new Promise( (resolve, reject) => {
    Category
      .remove({})
      .then(() => {
        Category
          .insertMany(categories)
          .then(resolve)
          .catch(reject)
      })
      .catch(reject)
  })
}
