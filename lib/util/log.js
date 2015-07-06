var path = require('path');
var config = require('config');
var bunyan = require('bunyan');

function isModule(arg) {
    return typeof arg === 'object' &&
        typeof arg.filename === 'string';
}

module.exports = function (arg) {
    var name;
    if (isModule(arg)) {
        name = path.basename(arg.filename, '.js');
    } else if (typeof arg === 'string') {
        name = arg;
    } else {
        throw new Error('log argument must be a module or a string');
    }
    return bunyan.createLogger({
        name: name,
        level: config.log.level
    });
}
