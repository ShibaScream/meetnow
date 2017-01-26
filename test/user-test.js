'use strict'

process.env.NODE_ENV = 'test'

const app = require('../index')

const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

let server = null

let username = 'far.away2@test.com'
let password = '1236pass'
let user2 = 'sees.lots@test.com'
let pass2 = '1235pass'
let token = null
let existingID = ''

chai.use(chaiHttp)

describe('authentication app', function() {

  before(function(done) {
    server = app.listen(3000, () => {
      console.log('test server started on port 3000')
      done()
    })
  })

  after(function(done) {
    server.close(function() {
      console.log('server closed')
      done()
    })
  })

  describe('POST /user', function() {
    it('should create a user', function(done) {
      chai
      .request(app)
      .post('/user')
      .send({
        'name': 'Far Away2',
        'password': password,
        'email': username,
        'currentLocation': {
          'type': 'Point',
          'coordinates': [117.4260, 47.6588]
        },
        'radius': 30,
        'gender': 'male',
        'age': 27,
        'interests': ['5886df9d3dfccb15c2f091cc']
      })
      .end(function(err, res) {
        expect(res).to.have.status(200)
        existingID = res.body._id
        done()
      })
    })
  })

  describe('GET /login', function() {
    it('should only return user\'s info for any user other than Admin', function(done) {
      chai
      .request(app)
      .get('/login')
      .auth(user2, pass2)
      .end(function(err, res) {
        expect(res).to.have.status(200)
        token = res.body.token
        expect(token).to.not.be.null
        done()
      })
    })
  })

  describe('GET /user/:userId', function() {
    it('should return a single user', function(done) {
      chai
      .request(app)
      .get(`/user/${existingID}`)
      .set('authorization', `Bearer ${token}`)
      .end(function(err, res) {
        expect(res).to.have.status(200)
        done()
      })
    })
  })

  describe('Searching', function() {
    it('should allow a user to search', function(done) {
      chai
      .request(app)
      .get('/user/search')
      .query({lng: 117.4260, lat: 47.6588})
      .set('authorization', `Bearer ${token}`)
      .end(function(err, res) {
        console.log(err)
        expect(res).to.have.status(200)
        done()
      })
    })
  })

  describe('DELETE /user', function() {
    it('should delete a user', function(done) {
      chai
      .request(app)
      .delete('/user/58853b381bec7e61ead38906')
      .set('authorization', `Bearer ${token}`)
      .end(function(err, res) {
        expect(res).to.have.status(202)
        done()
      })
    })
  })

  describe('PUT /user', function() {
    it('should update a user', function(done) {
      chai
      .request(app)
      .put('/user')
      .set('authorization', `Bearer ${token}`)
      .send({email: 'newEmail@test.com'})
      .end(function(err, res) {
        expect(res).to.have.status(200)
        done()
      })
    })

    it('should fail if sent empty body', function(done) {
      chai
      .request(app)
      .put('/user')
      .set('authorization', `Bearer ${token}`)
      .end(function(err, res) {
        expect(res).to.have.status(400)
        done()
      })
    })
  })

  describe('DELETE /user', function() {
    it('should delete a user', function(done) {
      chai
      .request(app)
      .delete('/user/58853b381bec7e61ead38906')
      .set('authorization', `Bearer ${token}`)
      .end(function(err, res) {
        expect(res).to.have.status(202)
        done()
      })
    })
  })
})
