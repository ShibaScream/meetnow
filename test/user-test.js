'use strict'

const assert = require('assert');
const User = require('../model/user-model');

describe('Creating user records', () => {
  it('Saves a user', (done) => {
    const david = new User({
      name: 'David',
      email: 'me@davidpuerto.com',
      password: 'heyguys'
    })
    david.save()
    .then(() => {
      assert(!david.isNew);
      done()
    })
  })
})
