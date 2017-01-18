const authMiddleware = require('../lib/authMiddleware');
const User = require('../model/user-model');

module.exports = function(router) {
  router.post('/user/', function(req, res, next) {
    new User(req.body).save().then(function(err, user) {
      if (err) throw err;
      delete user.password;
      res.json(user);
    }).catch(next);
  });

  router.get('/user/:userId', function(req, res, next) {
    //TODO if no user id is given, then show the user their logged in information
    User.findOneById(req.params.userId).then(function(err, user) {
      if (err) throw err;
      delete user.password;
      delete user.email;
      delete user.radius;
      //possibly make gender and other personal details optional to return
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
