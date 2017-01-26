// 'use strict'
//
// const assert = require('assert');
// const User = require('../model/user-model')
// const Interest = require('../model/interest-model')
// const Activity = require('../model/activity-model')
//
// // get the login request and get the token chai.request.app('/login') .auth
//
// describe('Create a new Activity', () => {
//   let david, interest, activity;
//
//   beforeEach((done) => {
//     david = new User({ name: 'David' });
//     activity = new Activity({ title: 'JS is Great', content: 'Yep it really is' });
//     interest = new Interest({ interets: 'Congrats on great post' });
//
//     david.interests.push(interest);
//     activity.interest.push(interest);
//     interest.user = david;
//
//     Promise.all([david.save(), interest.save(), activity.save()])
//       .then(() => done());
//   });
//
//   it('saves a relation between a user and an activity ', (done) => {
//     User.findOne({ name: 'David' })
//       .populate('interests')
//       .then((user) => {
//         assert(user.interests[0].name === 'Fun Run');
//         done();
//       });
//   });
//
//   it('saves a full relation graph', (done) => {
//     User.findOne({ name: 'David' })
//       .populate({
//         path: 'interests',
//         populate: {
//           path: 'activities',
//           model: 'activity',
//           populate: {
//             path: 'user',
//             model: 'user'          }
//         }
//       })
//       .then((user) => {
//         //console.log(user.blogPosts[0].comments[0]);
//         assert(user.name === 'David');
//         assert(user.interests[0].name === 'JS is Great');
//         done();
//       });
//   });
// });
