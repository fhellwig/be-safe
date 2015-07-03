// Uses morgan to log request to a bunyan logger.
//
// Usage: app.use(requestLogger(logger [, format [, options]]));

var morgan = require('morgan');

function requestLogger(logger, format, options) {
    format = format || 'dev';
    options = options || {};
    options.stream = createFakeStream(logger);
    return morgan(format, options);
}

function createFakeStream(logger) {
    return {
        write: function(text) {
            logger.trace(text.trim());
        }
    };
}

module.exports = requestLogger;
