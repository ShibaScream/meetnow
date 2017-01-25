'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const app = require('../index.js')
const Category = require('../model/category-model')

let server = null
let name = 'Test Category'
let token = null
let existingID = ''
let nonexistentID = '5888364ef758da1d519778cc'

chai.use(chaiHttp)

describe('category routes', () => {
  before(done => {
    server = app.listen(3000, function() {
      console.log('server up')
      chai.request(app)
      .get('/login')
      .auth('runs.more@test.com', '1234pass')
      .end(function(err, res) {
        expect(err).to.be.null
        token = JSON.parse(res.text).token
        Category
          .find({})
          .then(categories => {
            existingID = categories[0]._id
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
  describe('/category POST', function () {
    it('should fail for POST with no body', function(done) {
      chai
        .request(app)
        .post('/category')
        .set('authorization', `Bearer ${token}`)
        .end(function(err, res) {
          expect(res.status).to.equal(400)
          done()
        })
    })

    it('should succesfully POST new category', function(done) {
      chai
        .request(app)
        .post('/category')
        .set('authorization', `Bearer ${token}`)
        .send({category: name})
        .end(function(err, res) {
          expect(res.status).to.equal(200)
          expect(res.body).to.not.be.empty
          done()
        })
    })

    it('should fail for POST with existing category name', function(done) {
      chai
        .request(app)
        .post('/category')
        .set('authorization', `Bearer ${token}`)
        .send({category: name})
        .end(function(err, res) {
          expect(res.status).to.equal(500)
          expect(res.body).to.not.be.empty
          done()
        })
    })
  })

  describe('/categories GET', function() {
    it('should successfully GET all existing categories', function(done) {
      chai
        .request(app)
        .get('/categories')
        .end(function(err, res) {
          expect(res.status).to.equal(200)
          expect(res.body).to.not.be.empty
          done()
        })
    })
  })

  describe('/category/:id GET', function() {
    it('should successfully GET an existing id', function(done) {
      chai
        .request(app)
        .get(`/category/${existingID}`)
        .end(function(err, res) {
          expect(res.status).to.equal(200)
          expect(res.body).to.not.be.empty
          done()
        })
    })

    it('should fail without an id', function(done) {
      chai
        .request(app)
        .get('/category')
        .end(function(err, res) {
          expect(res.status).to.equal(404)
          done()
        })
    })

    it('should fail with a nonexistent ID', function(done) {
      chai
        .request(app)
        .get(`/category/${nonexistentID}`)
        .end(function(err, res) {
          expect(res.status).to.equal(404)
          done()
        })
    })
  })

  describe('/category DELETE', function() {
    
    it('should fail without authentication', function(done) {
      chai
        .request(app)
        .delete(`/category/${existingID}`)
        .end(function(err, res) {
          expect(res.status).to.equal(401)
          done()
        })
    })

    it('should fail without an id', function(done) {
      chai
        .request(app)
        .delete('/category')
        .set('authorization', `Bearer ${token}`)
        .end(function(err, res) {
          expect(res.status).to.equal(404)
          done()
        })
    })

    it('should fail silently with nonexistent id', function(done) {
      chai
        .request(app)
        .delete(`/category/${nonexistentID}`)
        .set('authorization', `Bearer ${token}`)
        .end(function(err, res) {
          expect(res.status).to.equal(202)
          expect(res.body).to.be.empty
          done()
        })
    })

    it('should successfully delete an existing id', function(done) {
      chai
        .request(app)
        .delete(`/category/${existingID}`)
        .set('authorization', `Bearer ${token}`)
        .end(function(err, res) {
          expect(res.status).to.equal(202)
          expect(res.body).to.be.empty
          done()
        })
    })
  })

})
