//----------------------------------------------------------------------------
// FDA API Helper Module
//
// Exports the get() method.
//
// Frank Hellwig <frank.hellwig@buchanan-edwards.com>
//----------------------------------------------------------------------------

//----------------------------------------------------------------------------
// MODULE IMPORTS
//----------------------------------------------------------------------------

var http = require('http');
var https = require('https');
var env = require('./env');

//----------------------------------------------------------------------------
// MODULE CONSTANTS
//----------------------------------------------------------------------------

var HOSTNAME = 'api.fda.gov';

//----------------------------------------------------------------------------
// PUBLIC FUNCTIONS
//----------------------------------------------------------------------------

// callback(response) where the response is a JSend object.
function get(path, skip, limit, search, callback) {
  var params = [];
  params.push('api_key=' + env.get('OPEN_FDA_API_KEY'));
  params.push('skip=' + skip);
  params.push('limit=' + limit);
  params.push('search=' + search);
  var options = {
    method: 'GET',
    hostname: HOSTNAME,
    port: 443,
    path: path + '?' + params.join('&'),
    headers: {
      'Accept': 'application/json'
    }
  };

  function processResponse(res) {
    var buf = [];
    res.setEncoding('utf8');
    res.on('data', function (data) {
      buf.push(data);
    });
    res.on('end', function () {
      var json = buf.join('');
      var data = json.length ? JSON.parse(json) : null;
      var status = res.statusCode;
      if (status === 204) {
        callback({
          status: 'success',
          data: {
            skip: skip,
            limit: limit,
            total: 0,
            results: []
          }
        });
      } else if (status >= 200 && status <= 299) {
        callback({
          status: 'success',
          data: {
            skip: data.meta.results.skip,
            limit: data.meta.results.limit,
            total: data.meta.results.total,
            results: data.results
          }
        });
      } else {
        if (status == 404) {
          callback({
            status: 'success',
            data: {
              skip: skip,
              limit: limit,
              total: 0,
              results: []
            }
          });
        } else {
          var message;
          if (data && data.error && data.error.message) {
            message = data.error.message;
          } else {
            message = http.STATUS_CODES[status];
          }
          callback({
            status: 'error',
            code: status,
            message: message
          });
        }
      }
    });
  }
  var req = https.request(options, processResponse);
  req.on('error', function (e) {
    callback({
      status: 'error',
      code: 0,
      message: 'Cannot reach the ' + HOSTNAME + ' server. Please check your network connection.'
    });
  });
  req.end();
}

//----------------------------------------------------------------------------
// EXPORTS
//----------------------------------------------------------------------------

module.exports = {
  get: get,
};
