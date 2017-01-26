'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const app = require('../index.js')
const Interest = require('../model/interest-model')

let server = null
let token = null
let name = 'Testing'
let category = '58881bef7321871b033e6e2c'
let testInterest = {
  name: name,
  category: category
}
let existingInterestID = ''
let nonexistentID = '58881bef7321871b033e6e2c'

chai.use(chaiHttp)

describe('interest routes', function() {

  before(done => {
    server = app.listen(3000, function() {
      console.log('server up')
      chai
        .request(app)
        .get('/login')
        .auth('runs.more@test.com', '1234pass')
        .end(function(err, res) {
          expect(err).to.be.null
          token = JSON.parse(res.text).token
          Interest
            .find({})
            .then(interests => {
              existingInterestID = interests[0]._id
              done()
            })
        })
    })
  })

  after(function(done) {
    server.close(function() {
      console.log('server closed')
      done()
    })
  })

  describe('/interest POST', function () {
    it('should return bad request for POST with no body', function(done) {
      chai
        .request(app)
        .post('/interest')
        .set('authorization', `Bearer ${token}`)
        .end(function(err, res) {
          expect(res.status).to.equal(400)
          done()
        })
    })

    it('should return a 401 for a POST with no user token', function(done) {
      chai
        .request(app)
        .post('/interest')
        .send(testInterest)
        .end(function(err, res) {
          expect(res.status).to.equal(401)
          done()
        })
    })

    it('should fail if a name is not included', function(done) {
      testInterest.name = undefined
      chai
        .request(app)
        .post('/interest')
        .set('authorization', `Bearer ${token}`)
        .send(testInterest)
        .end(function(err, res) {
          expect(res.status).to.equal(500)
          done()
        })
    })

    it('should fail if a category is not included', function(done) {
      testInterest.name = name
      testInterest.category = undefined
      chai
        .request(app)
        .post('/interest')
        .set('authorization', `Bearer ${token}`)
        .send(testInterest)
        .end(function(err, res) {
          expect(res.status).to.equal(500)
          done()
        })
    })

    it('should successfully POST a new interest', function(done) {
      testInterest.name = name
      testInterest.category = category
      chai
        .request(app)
        .post('/interest')
        .set('authorization', `Bearer ${token}`)
        .send(testInterest)
        .end(function(err, res) {
          expect(res.status).to.equal(200)
          expect(res.body.name).to.equal(name)
          expect(res.body.category).to.equal(category)
          done()
        })
    })

    it('should fail if a name already exists', function(done) {
      chai
        .request(app)
        .post('/interest')
        .set('authorization', `Bearer ${token}`)
        .send(testInterest)
        .end(function(err, res) {
          expect(res.status).to.equal(500)
          done()
        })
    })
  })

  describe('/interests GET', function () {
    it('should successfully get all existing interests', function(done) {
      chai
        .request(app)
        .get('/interests')
        .end(function(err, res) {
          expect(res.status).to.equal(200)
          expect(res.body).to.not.be.empty
          done()
        })
    })
  })

  describe('/interest/:id GET', function () {
    it('should succesfully get an existing interest', function(done) {
      chai
        .request(app)
        .get(`/interest/${existingInterestID}`)
        .end(function(err, res) {
          expect(res.status).to.equal(200)
          expect(res.body).to.not.be.empty
          done()
        })
    })

    it('should fail if not given an interest id', function(done) {
      chai
        .request(app)
        .get('/interest')
        .end(function(err, res) {
          expect(res.status).to.equal(404)
          done()
        })
    })

    it('should fail if not given a nonexistent interest id', function(done) {
      chai
        .request(app)
        .get(`/interest/${nonexistentID}`)
        .end(function(err, res) {
          expect(res.status).to.equal(404)
          done()
        })
    })
  })

  describe('/interest DELETE', function () {
    it('should fail when no authorization token included', function(done) {
      chai
        .request(app)
        .delete(`/interest/${existingInterestID}`)
        .end(function(err, res) {
          expect(res.status).to.equal(401)
          done()
        })
    })

    it('should fail silently if given a nonexistent id', function(done) {
      chai
        .request(app)
        .delete(`/interest/${nonexistentID}`)
        .set('authorization', `Bearer ${token}`)
        .end(function(err, res) {
          expect(res.status).to.equal(202)
          done()
        })
    })

    it('should fail if given no id', function(done) {
      chai
        .request(app)
        .delete('/interest')
        .set('authorization', `Bearer ${token}`)
        .end(function(err, res) {
          expect(res.status).to.equal(404)
          done()
        })
    })

    it('should succesfully delete existing object', function(done) {
      chai
        .request(app)
        .delete(`/interest/${existingInterestID}`)
        .set('authorization', `Bearer ${token}`)
        .end(function(err, res) {
          expect(res.status).to.equal(202)
          done()
        })
    })
  })
})
