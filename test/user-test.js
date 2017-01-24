'use strict'

process.env.NODE_ENV = 'test'

const app = require('../index')

const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')

//const User = require('../model/user-model')

chai.use(chaiHttp)

let server = null

let username = 'tester'
let password = 'test'
let token = ''

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
      console.log('server closed');
      done()
    })
  })

  describe('POST /user', function() {
    it('should create a user', function(done) {
      chai
      .request(app)
      .post('/user')
      .send({
        name: 'dpuert@gmail.com',
        password: password,
        email: username,
        currentLocation: [122.3321, 47.6062],
        radius: 10,
        gender: 'male',
        age: 32 ,
        interests: ['58853b381bec7e61ead3890a', '58853b381bec7e61ead3890c', '58853b381bec7e61ead38910']
      })
      .end(function(err, res) {
        expect(res).to.have.status(200)
        // expect(res.body).to.not.be.array
        // expect(res.body.username).to.equal(username)
        done()
      })
    })
  })

  describe('GET /user', function() {
    it('should only return user\'s info for any user other than Admin', function(done) {
      chai
      .request(app)
      .get('/login')
      .auth(username, password)
      //.set('authorization', `Bearer ${token}`)
      .end(function(err, res) {
        expect(res).to.have.status(200)
        // expect(res.body).to.not.be.array
        // expect(res.body.username).to.equal(username)
        done()
      })
    })
  })
})
