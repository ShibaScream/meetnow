'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const app = require('../index.js')
const Activity = require('../model/activity-model.js')
let server = null

// SEEDS
const initSeeds = require('../seeds/seedInit')

const activityData = {
  description: 'test description text',
  interest: '58855624c607c70f24b00597',
  startLocation: {
    type: 'Point',
    coordinates: [
      122.3321,
      47.6062
    ]
  }
}
const newActivityData = { description: 'new description text'}
let activity = null
// let activityTwo = null
let token = null
chai.use(chaiHttp)

describe('activity-routes.js', () => {
  before(done => {
    server = app.listen(3000, function() {
      console.log('server up')
      initSeeds()
      .then(() => {
        chai
        .request(app)
        .get('/login')
        .auth('runs.more@test.com', '1234pass')
        .end(function(err, res) {
          expect(err).to.be.null
          token = JSON.parse(res.text).token
          done()
        })
      })
      .catch(err => console.error(err))
    })
  })

  after(function(done) {
    server.close(function() {
      console.log('server closed')
      done()
    })
  })

  describe('/activity POST', function () {
    it('should return bad request for POST with no body', function(done) {
      chai.request(app)
      .post('/activity')
      .set('authorization', `Bearer ${token}`)
      .end(function(err, res) {
        expect(res.status).to.equal(400)
        done()
      })
    })
    it('should return 401 for request without a token', function(done) {
      chai.request(app)
      .post('/activity')
      .send(activityData)
      .end(function(err, res) {
        expect(res.status).to.equal(401)
        done()
      })
    })
    it('should create an event and return 200 for valid requests', (done) => {
      chai.request(app)
      .post('/activity')
      .set('authorization', `Bearer ${token}`)
      .send(activityData)
      .end(function(err, res) {
        if (err) console.log('Err on Activity POST route', err)
        expect(res.status).to.equal(200)
        expect(res.body.description).to.equal(activityData.description)
        expect(res.body.interest).to.equal(activityData.interest)
        activity = res.body
        done()
      })
    })
    it('should return 403 when user already has an existing activity', (done) => {
      chai.request(app)
      .post('/activity')
      .set('authorization', `Bearer ${token}`)
      .send(activityData)
      .end(function(err, res) {
        expect(res.status).to.equal(403)
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
      .set('authorization', `Bearer ${token}`)
      .end(function(err, res) {
        expect(res.status).to.equal(200)
        expect(res.body.description).to.equal(activity.description)
        expect(res.body.host).to.equal(activity.host)
        expect(res.body._id).to.equal(activity._id)
        done()
      })
    })
  })
  describe('/activity/search', function() {
    it('should return 200 for a valid request', function(done) {
      activity.nearbyUsers = []
      chai.request(app)
      .get('/activity/search')
      .query({ lat:47.6062, lng:122.3321})
      .end(function(err, res) {
        expect(res.status).to.equal(200)
        expect(res.body).to.include(activity)
        done()
      })
    })
    it('should return 404 when no activities are found with the specified interest', function(done) {
      chai.request(app)
      .get('/activity/search')
      .query({lat:47.6062, lng:122.3321, interest: '58881684c2e03d0f91f125a9'})
      .end(function(err, res) {
        expect(res.status).to.equal(404)
        done()
      })
    })
    it('should return 404 when no activities are found withing the search area', function(done) {
      chai.request(app)
      .get('/activity/search')
      .query({dist:1, lat:1, lng:1})
      .end(function(err, res) {
        expect(res.status).to.equal(404)
        done()
      })
    })
    it('should return 400 if lat or lng is undefined', function(done) {
      chai.request(app)
      .get('/activity/search')
      .query({lat:47.6062})
      .end(function(err, res) {
        expect(res.status).to.equal(400)
        done()
      })
    })
    it('should return 400 for a request without lat and lng values', function(done) {
      chai.request(app)
      .get('/activity/search')
      .end(function(err, res) {
        expect(res.status).to.equal(400)
        done()
      })
    })
  })
  describe('/activity/:id PUT', function() {
    it('should return 401 unauthorized for request without a token', function(done) {
      chai.request(app)
      .put(`/activity/${activity._id}`)
      .send(newActivityData)
      .end(function(err, res) {
        expect(res.status).to.equal(401)
        done()
      })
    })
    it('should return 401 for a request with the wrong user token', function(done) {
      chai.request(app)
      .put(`/activity/${activity._id}`)
      .set('authorization', 'Bearer BADTOKEN')
      .send(newActivityData)
      .end(function(err, res) {
        expect(res.status).to.equal(401)
        done()
      })
    })
    it('should return 400 for a request without a body', function(done) {
      chai.request(app)
      .put(`/activity/${activity._id}`)
      .set('authorization', `Bearer ${token}`)
      .end(function(err, res) {
        expect(res.status).to.equal(400)
        done()
      })
    })
    it('should return 404 when trying to change an activity that does not exist', function(done) {
      chai.request(app)
      .put('/activity/58856046fd98115467e5f7a0')
      .set('authorization', `Bearer ${token}`)
      .send(newActivityData)
      .end(function(err, res) {
        expect(res.status).to.equal(404)
        done()
      })
    })
    it('should return 200 for a valid request', function(done) {
      chai.request(app)
      .put(`/activity/${activity._id}`)
      .set('authorization', `Bearer ${token}`)
      .send(newActivityData)
      .end(function(err, res) {
        expect(res.status).to.equal(200)
        done()
      })
    })
  })

  describe('/activity/join', function() {
    it('should return 400 when no body is provided', function(done) {
      chai.request(app)
      .post('/activity/join')
      .set('authorization', `Bearer ${token}`)
      .end(function(err, res) {
        expect(res.status).to.equal(400)
        done()
      })
    })
  })
  it('should add a user to the participants', function(done) {
    Activity
      .findOne({description: 'testOne'})
      .then(act => {
        chai.request(app)
          .post('/activity/join')
          .set('authorization', `Bearer ${token}`)
          .send({id: act._id})
          .end(function(err, res) {
            if (err) console.log('Err on Activity POST JOIN route', err)
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
    it('should return 401 for a request with the wrong user token', function(done) {
      chai.request(app)
      .del(`/activity/${activity._id}`)
      .set('Authorization', 'Bearer BADTOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(401)
        done()
      })
    })
    it('should return 404 when trying to delete an activity that does not exist', function(done) {
      chai.request(app)
      .del('/activity/58856046fd98115467e5f7a0')
      .set('authorization', `Bearer ${token}`)
      .end(function(err, res) {
        expect(res.status).to.equal(404)
        done()
      })
    })
    it('should return 202 when an activity is deleted', function(done) {
      chai.request(app)
      .del(`/activity/${activity._id}`)
      .set('authorization', `Bearer ${token}`)
      .end(function(err, res) {
        expect(res.status).to.equal(202)
        // Activity.findById(activity._id)
        // .then(activity => {
        //   expect(activity).to.not.exist
        done()
        // })
      })
    })
  })
})
