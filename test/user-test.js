'use strict'

process.env.NODE_ENV = 'test'

const app = require('../index')

const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')

//const User = require('../model/user-model')

chai.use(chaiHttp)

let server = null

let username = 'far.away2@test.com'
let password = '1236pass'
let user2 = 'sees.lots@test.com'
let pass2 = '1235pass'
let token = null

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
        // console.log(res)
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
      .auth(user2, pass2)
      //.set('authorization', `Bearer ${token}`)
      .end(function(err, res) {
        expect(res).to.have.status(200)
        token = res.body.token
        expect(token).to.not.be.null
        // expect(res.body).to.not.be.array
        // expect(res.body.username).to.equal(username)
        done()
      })
    })
  })
})
