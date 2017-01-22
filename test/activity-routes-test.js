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
let token = null // <--- maybe
chai.use(chaiHttp)

describe('activity-routes.js', function() {
  before(function(done) {
    server = app.listen(3000, function() {
      console.log('server up')
    })
    User.findOne({name: 'Runs More'})
    .then(function(err, user) {
      testUser = user
      console.log(testUser)
    }).catch(function(err) {
      console.log('findOne failed')
    })
    chai.request(app)
    .post('/login')
    .auth('runs.more@test.com', '1234pass')
    .end(function(err, res) {
      token = 'someThing' // update when userSeeds added
      console.log(res)
    })
    done()
  })
  after(function(done) {
    server.close(function() {
      console.log('server closed')
    })
    done()
  })
  describe('/activity POST', function() {
    it('should return bad request for POST with no body', function(done) {
      chai.request(app)
      .post('/activity')
      .end(function(err, res) {
        expect(res.status).to.equal(400)
        done()
      })
    })
    it('should return 401 for request without a token', function(done) {
      chai.request(app)
      .post('/activity')
      .send({description: 'test description text', interest: 10, host: testUser._id, startLocation: 'starting location', startTime: Date.now()}) // update when seeds added
      .end(function(err, res) {
        expect(res.status).to.equal(401)
        done()
      })
    })
    it('should create an event and return 200 for valid requests', function(done) {
      chai.request(app)
      .post('/activity')
      .set('Authorization', 'Bearer ' + token) // not sure about this format
      .send({description: 'test description text', interest: 10, host: testUser._id, startLocation: 'starting location', startTime: Date.now()}) // update when seeds added
      .end(function(err, res) {
        expect(res.status).to.equal(200)
        activity = 'something from res' // update when seeds added
        done()
      })
    })
  })
  describe('/activity/:id GET', function() {
    it('should return 404 for unfound activities', function(done) {
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
  describe('/activity/:id PUT', function() {
    it('should return 401 unauthorized for request without a token', function(done) {
      chai.request(app)
      .put(`/activity/${activity._id}`)
      .send({description: 'new description', interest: 10, host: testUser._id, startLocation: 'new location', startTime: Date.now()}) // update when seeds added
      .end(function(err, res) {
        expect(res.status).to.equal(401)
        done()
      })
    })
    it('should return 403 for a request with the wrong user token', function(done) {
      chai.request(app)
      .put(`/activity/${activity._id}`)
      .set('Authorization', 'Bearer BADTOKEN') // enter a valid token for the incorrect user here
      .send({description: 'new description', interest: 10, host: testUser._id, startLocation: 'new location', startTime: Date.now()}) // update when seeds added
      .end(function(err, res) {
        expect(res.status).to.equal(403)
        done()
      })
    })
    it('should return 400 for a request without a body', function(done) {
      chai.request(app)
      .put(`/activity/${activity._id}`)
      .send({description: 'new description', interest: 10, host: testUser._id, startLocation: 'new location', startTime: Date.now()}) // update when seeds added
      .end(function(err, res) {
        expect(res.status).to.equal(400)
        done()
      })
    })
    it('should return 404 when trying to change an activity that does not exist', function(done) {
      chai.request(app)
      .put('/activity/10')
      .set('Authorization', 'Bearer ' + token) // check format for this
      .send({description: 'new description', interest: 10, host: testUser._id, startLocation: 'new location', startTime: Date.now()}) // update when seeds added
      .end(function(err, res) {
        expect(res.status).to.equal(404)
        done()
      })
    })
    it('should return 200 for a request without a body', function(done) {
      chai.request(app)
      .put(`/activity/${activity._id}`)
      .set('Authorization', 'Bearer ' + token) // check format for this
      .send({description: 'new description', interest: 10, host: testUser._id, startLocation: 'new location', startTime: Date.now()}) // update when seeds added
      .end(function(err, res) {
        expect(res.status).to.equal(200)
        done()
      })
    })
  })
  describe('/activity/:id DELETE', function() {
    it('should return 401 unauthorized for request without a token', function(done) {
      chai.request(app)
      .del(`/activity/${activity._id}`)
      .end(function(err, res) {
        expect(res.status).to.equal(401)
        done()
      })
    })
    it('should return 403 for a request with the wrong user token', function(done) {
      chai.request(app)
      .del(`/activity/${activity._id}`)
      .set('Authorization', 'Bearer BADTOKEN') // enter a valid token for the incorrect user here
      .end(function(err, res) {
        expect(res.status).to.equal(403)
        done()
      })
    })
    it('should return 404 when trying to delete an activity that does not exist', function(done) {
      chai.request(app)
      .del('/activity/10')
      .set('Authorization', 'Bearer ' + token) // check format for this
      .end(function(err, res) {
        expect(res.status).to.equal(404)
        done()
      })
    })
    it('should return 202 when an activity is deleted', function(done) {
      chai.request(app)
      .del(`/activity/${activity._id}`)
      .set('Authorization', 'Bearer ' + token) // check format for this
      .end(function(err, res) {
        expect(res.status).to.equal(202)
        done()
      })
    })
  })
})