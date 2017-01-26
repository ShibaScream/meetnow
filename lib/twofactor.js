'use strict'

const KEYS = { };

function TwoFactorKey(userId, timeWindow) {
  this.key = Math.floor((Math.random() * 89999) + 10000).toString();
  setTimeout(() => {
    KEYS[userId] = undefined;
  }, timeWindow * 60000);
  KEYS[userId] = this;
}

module.exports.createKey = function(userId, timeWindow) {
  return new TwoFactorKey(userId, timeWindow);
}

module.exports.isValid = function(userId, key) {
  return KEYS[userId] != undefined && KEYS[userId].key == key;
}

module.exports.deleteKey = function(userId) {
  KEYS[userId] = undefined;
}

module.exports.hasPendingKey = function(userId) {
  return KEYS[userId] != undefined;
}
