const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const app = require('../index.js')
const Activity = require('../model/activity-model.js')
let server = null
let activity = null
chai.use(chaiHttp)

//query for user and findOne name: whatever
//log in user to get token
describe('activity-routes.js', function() {
  before(function(done) {
    server = app.listen(3000, function() {
      console.log('server up')
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
      chai.request('http://localhost:3000')
      .get('/activitiy/01')
      .end(function(err, res) {
        expect(res.status).to.equal(404)
        done()
      })
    })
    it('should return an activity from the database', function(done) {
      chai.request('http://localhost:3000')
      .get(`/activity/${activity._id}`)
      .end(function(err, res) {
        console.log(activity)
        expect(res.status).to.equal(200)
        done()
      })
    })
  })
})