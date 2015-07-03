var http = require('http');

// Returns an object having the code and message properies.
function errorResponse(err) {
    var obj = {};
    if (typeof err === 'string') {
        obj.code = 500;
        obj.message = err;
    } else if (typeof err === 'number') {
        obj.code = err;
        obj.message = null;
    } else {
        if (typeof err.code === 'number') {
            obj.code = err.code;
        } else if (typeof err.status === 'number') {
            obj.code = err.status;
        } else if (typeof err.statusCode === 'number') {
            obj.code = err.statusCode;
        } else {
            obj.code = 500;
        }
        if (typeof err.message === 'string') {
            obj.message = err.message;
        } else {
            obj.message = null;
        }
    }
    if (!obj.message) {
        obj.message = http.STATUS_CODES[obj.code];
        if (!obj.message) {
            obj.message = 'Unknown Error';
        }
    }
    return obj;
}

function errorHandler(err, req, res, next) {
    var error = errorResponse(err);
    res.status(error.code).send(error);
}

module.exports = errorHandler;
