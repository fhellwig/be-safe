var aws = require('aws-sdk');
var log = require('../util/log')(module);
var validator = require('validator');
var async = require('async');
var sqlite3 = require("sqlite3").verbose();
var config = require('config');
var pkgfinder = require('pkgfinder');

var pkg = pkgfinder();
var file = pkg.resolve('data/besafe.db');

init(file);

function list(res) {
    log.trace('list function');
    var db = new sqlite3.Database(file);
    var out = {};
    async.series([
            function (cb) {
                db.all("SELECT * FROM reportsData", function (err, rows) {
                    if (err) {
                        return cb(err);
                    }
                    log.debug("rows ", rows);
                    out = rows;
                    cb();
                });
            }
        ],
        function (err) {
            if (err) {
                return new Error(err);
            }
            db.close();
            //res.send(out);
        });
}

function storeData(req, res) {
    log.trace('storeData', req.body);
    var db = new sqlite3.Database(file);
    var inputEmail = null;
    if (typeof req.body.email !== 'undefined' && validator.isEmail(req.body.email)) {
        inputEmail = req.body.email;
    }
    var report = req.body.complaint;
    var searchCriteria = JSON.stringify(req.body.query);
    var searchResult = JSON.stringify(req.body.report);
    async.series([
            function (cb) {
                db.run("INSERT INTO reportsData (email, searchCriteria, searchResult, complaint) VALUES (?, ?2, ?3, ?4)", {
                    1: inputEmail,
                    2: searchCriteria,
                    3: searchResult,
                    4: report
                }, function (err) {
                    if (err) {
                        return cb(err)
                    };
                    log.trace("inserted data");
                    list();
                    output = {
                        msg: "Added new Subscription.",
                        status: 200
                    };
                    cb();
                });
            }
        ],
        function (err) {
            log.trace("Got here");
            if (err) {
                log.error(err);
                return new Error(err);
            }
            db.close();
            res.send(output);
        });
}

function init(file) {
    var fs = require("fs");
    var exists = fs.existsSync(file);
    var db = new sqlite3.Database(file);
    log.trace('Initializing module');
    if (!exists) {
        log.info('Creating DB file.');
        fs.openSync(file, "w");
    }
    db.run("create table if not exists reportsData (id integer primary key autoincrement, email text, searchCriteria text not null, searchResult text not null, complaint text not null, reportDate timestamp default CURRENT_TIMESTAMP)");
    db.close();
}

module.exports = {
    init: init,
    list: list,
    storeData: storeData
};
