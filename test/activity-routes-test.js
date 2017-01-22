'use strict'
const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const app = require('../index.js')
// const Activity = require('../model/activity-model.js')
const User = require('../model/user-model.js')
let server = null
let activity = null
let testUser = null // <--- maybe
chai.use(chaiHttp)

//query for user and findOne name: whatever
//log in user to get token
describe('activity-routes.js', function() {
  before(function(done) {
    server = app.listen(3000, function() {
      console.log('server up')
    })
    User.findOne({name: 'Runs More'})
    .then(function(err, user) {
      //something err
      testUser = user
    })
    //login in the testUser to get token
    chai.request(app)
    .post('/login')
    .auth('runs.more@test.com', '1234pass')
    .end(function(err, res) {
      
      //assign token to something
      console.log(res)
    })

    // remove this junk
    // activity = new Activity({
    //   location: 'test',
    //   startTime: Date.now(),
    //   endTime: Date.now()
    // })
    done()
  })
  after(function(done) {
    server.close(function() {
      console.log('server closed')
    })
    done()
  })
  describe('activity/:id GET', function() {
    it('should return an activity from the database', function(done) {
      chai.request(app)
      .get('/activitiy/01')
      .end(function(err, res) {
        expect(res.status).to.equal(404)
        done()
      })
    })
    it('should return an activity from the database', function(done) {
      chai.request(app)
      .get(`/activity/${activity._id}`)
      .end(function(err, res) {
        console.log(activity)
        expect(res.status).to.equal(200)
        done()
      })
    })
  })
})