var config = require('config');
var log = require('./util/log')(module);

module.exports.get = function (name) {
  var value = process.env[name];
  if (!value) {
    value = config.env[name];
  }
  if (!value) {
    log.warn('The %s setting is not available. Please set this in your environment or config file.', name);
  }
  return value || null;
}
