module.exports = function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500).json({msg: err.message} ||{msg: 'Bad Request'})
    next()
  }
}