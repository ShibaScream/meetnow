'use strict'

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/meetnow'

// EXPRESS SERVER
const Express = require('express')
const router = Express.Router()
const app = Express()

// SEEDS
const categorySeeds = require('./seeds/categorySeeds')
const interestSeeds = require('./seeds/interestSeeds')

// ROUTES
// const User = require('./model/user')
// const Interest = require('./model/interest')
// const Category = require('./model/category')
// const Activity = require('./model/Activity')
require('./routes/activity-routes')(router)
// require('./routes/category-routes')(router)
// require('./routes/interest-routes')(router)
require('./routes/user-routes')(router)

// DEV
const morgan = require('morgan')
app.use(morgan('dev'))
// const httpErrors = require('./lib/httpErrors')

// MONGODB
const mongoose = require('mongoose')
mongoose.Promise = Promise
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`Mongo connected via ${MONGO_URI}`)
    categorySeeds
      .seedCategories()
      .then(categories => {
        interestSeeds.seedInterests(categories)
      })
      .catch(err => console.error(err))
  })
  .catch(err => console.error(err))

app.use(router)
// app.use(httpErrors)

if(require.main === module) {
  app.listen(PORT, () => console.log(`server started on port ${PORT}`))
}

module.exports = app
