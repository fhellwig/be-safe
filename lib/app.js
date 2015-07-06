var log = require('./util/log')(module);
var jsend = require('jsend');
var config = require('config');
var express = require('express');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pkgfinder = require('pkgfinder');
var requestLogger = require('./util/request-logger');

var app = express();
var pkg = pkgfinder();

app.use(jsend.middleware);

app.use(requestLogger(log, 'dev'));

//app.use(favicon(pkg.resolve('public/images/favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.set('json spaces', 4);

app.use('/api', require('./api'));

app.use('/', sslRedirect);

app.use('/carousel', express.static(pkg.resolve('data/carousel/images')));
app.use('/', express.static(pkg.resolve('public')));

function sslRedirect(req, res, next) {
  if (isLocal(req) || isSecure(req)) {
    next();
  } else {
    log.info('Redirecting to SSL');
    res.redirect('https://' + req.headers.host + req.url);
  }
}

function isLocal(req) {
  return req.hostname === 'localhost';
}

function isSecure(req) {
  // Check the trivial case first.
  if (req.secure) {
    return true;
  }
  // Check if we are behind Application Request Routing (ARR).
  if (req.headers['x-arr-log-id']) {
    return typeof req.headers['x-arr-ssl'] === 'string';
  }
  // Check for forwarded protocol header (AWS).
  return req.headers['x-forwarded-proto'] === 'https';
}

module.exports = app;
