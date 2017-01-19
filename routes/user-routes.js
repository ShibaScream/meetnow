const parseAuth = require('basic-auth');
const authMiddleware = require('../lib/authMiddleware');
const User = require('../model/user-model');

module.exports = function(router) {
  router.post('/user', function(req, res, next) {
    new User(req.body).save().then(function(err, user) {
      if (err) throw err;
      delete user.password;
      res.json(user);
    }).catch(next);
  });

  router.post('/login', function(req, res, next) {
    let auth = parseAuth(req);
    if (!auth) throw new Error('Expected authorization header.');
    User.findOne({ email: auth.name }, function (err, user) {
      if (err) throw err;
      user.checkPass(auth.pass).then((correct) => {
        if (correct)
          res.json({ token: 'token here' });
        else
          throw new Error('Invalid credentials.');
      });
    }).catch(next);
  });

  router.get('/user/:userId', authMiddleware, function(req, res, next) {
    User.findOneById(req.params.userId || req.authorizedUserId).then(function(err, user) {
      if (err) throw err;
      delete user.password;
      delete user.email;
      delete user.radius;
      //possibly make gender and other personal details optional to return
      res.json(user);
    }).catch(next);
  });

  router.put('/user', authMiddleware, function(req, res, next) { //TODO add pre 'update' function to schema to hash password if password was updated
    User.findByIdAndUpdate(req.authorizedUserId, { new: true }, req.body).then(function(err, user) {
      if (err) throw err;
      delete user.password;
      res.json(user);
    }).catch(next);
  });

  router.delete('/user/:userId', authMiddleware, function(req, res, next) {
    User.findByIdAndRemove(req.params.userId).then(function(err) {
      if (err) throw err;
      res.status(202);
      res.end();
    }).catch(next);
  });
};
