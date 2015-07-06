// Creates the HTTP server. Start the server by calling server.start().

var log = require('./util/log')(module);
var config = require('config');
var http = require('http');
var app = require('./app');

// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || config.server.port);
app.set('port', port);

function start() {
  var server = http.createServer(app);
  server.on('error', onError);
  server.on('listening', function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    log.info('Listening on ' + bind);
  });
  server.listen(port);
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val; // named pipe
  }
  if (port >= 0) {
    return port; // port number
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      log.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      log.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function checkConfigValue(name) {
  var value = getConfigValue(name);
  if (typeof value === 'undefined' ||
    (typeof value === 'string' && value.indexOf('you must set') === 0)) {
    log.warn('The configuration value %s has not been set. ' +
      'Please set this value (or override it using a local.json file).', name);
  }
}

function getConfigValue(name) {
  var properties = name.split('.');
  var value = config;
  properties.forEach(function (property) {
    value = value[property];
    if (typeof value === 'undefined') {
      return value;
    }
  });
  return value;
}

checkConfigValue('gov.fda.open.api_key');
checkConfigValue('aws.region');
checkConfigValue('aws.secretAccessKey');
checkConfigValue('aws.accessKeyId');

module.exports = {
  start: start
};
