'use strict'

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/meetnow'
const SEED_DB = process.env.SEED_DB || false

// EXPRESS SERVER
const Express = require('express')
const router = Express.Router()
const app = Express()

//UTILITY MODULES
// const createError = require('http-errors')
const bodyParser = require('body-parser')

// SEEDS
const initSeeds = require('./seeds/seedInit.js')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// ROUTES
require('./routes/user-routes')(router)
require('./routes/activity-routes')(router)
require('./routes/interest-routes')(router)
require('./routes/category-routes')(router)

// DEV
const morgan = require('morgan')
app.use(morgan('dev'))
const httpErrors = require('./lib/httpErrors')

// MONGODB
const mongoose = require('mongoose')
mongoose.Promise = Promise

var options = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } }
}

mongoose
  .connect(MONGO_URI, options)
  .then(() => {
    console.log(`Mongo connected via ${MONGO_URI}`)
    if (SEED_DB) {
      initSeeds()
    }
  })
  .catch(err => console.error(err))

app.use(router)
app.use(httpErrors)

app.get('/', (req, res) => {
  res.status(200).json({msg: 'Welcome to the MeetNow app. Please refer to documentation for proper routing.'})
})
app.get('*', (req, res) => {
  res.status(404).json({msg: 'Route does not exist!'})
})

// if not running mocha tests, start listening
if(require.main === module) {
  app.listen(PORT, () => console.log(`server started on port ${PORT}`))
}

module.exports = app
