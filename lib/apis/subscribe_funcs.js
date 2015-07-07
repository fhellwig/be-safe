/*
 *
 * Basic /api/subscribe handler
 *
 * ver .04
 */

var aws = require('aws-sdk');
var log = require('../util/log')(module);
var env = require('../env');
var validator = require('validator');
var async = require('async')
var uuid = require('uuid');
var sqlite3 = require("sqlite3").verbose();
var config = require('config');
var pkgfinder = require('pkgfinder');
var pkg = pkgfinder();
var file = pkg.resolve('data/besafe.db');
var drugs = require('../search/drugs');

init(file);

function list(res) {
  var db = new sqlite3.Database(file);
  var out = {};

  async.series([
      function(cb) {
        db.all("SELECT * FROM subscriptions", function(err, rows) {
          if (err) return cb(err);

          log.trace("rows ", rows);
          out = rows;
          cb();
        });
      }
    ],
    function(err) {
      if (err) return new Error(err)
      db.close();
      res.send(out);
    });
}

function init(file) {
  var fs = require("fs");
  var exists = fs.existsSync(file);

  if (!exists) {
    log.info('Creating DB file.');
    fs.openSync(file, "w");
  }

  var db = new sqlite3.Database(file);
  db.run(
    "create table if not exists subscriptions (id integer primary key autoincrement,email text not null,query text not null,uuid test,sub_type text not null,createdat timestamp default CURRENT_TIMESTAMP)"
  );
  db.close();
}

function unsubscribe(uuid, callback) {
  var db = new sqlite3.Database(file);
  db.run('DELETE FROM subscriptions WHERE uuid = ?', uuid,
    function(err) {
      if (err) {
        callback('Unsubscribe error: ' + err.message);
      } else if (this.changes > 0) {
        callback(null, 'Unsubscribe success');
      } else {
        callback(null, 'You were already unsubscribed');
      }
    }
  );
}

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}

function subscribe(email, query, unsubscribeLink, callback) {
  //start the db when the route is called since we have a "real" email
  var db = new sqlite3.Database(file);
  var inputEmail = email;
  var subType = query.search_type
  var query_for_db = JSON.stringify(query);
  var orig_query = query;

  var UUID = uuid.v4();
  var recordCount = 0;
  var output = '';

  async.series([
      function(cb) {
        db.get(
          "select count(email) as count, query from subscriptions where email=? and sub_type=?2", {
            1: inputEmail,
            2: subType
          },
          function(err, row) {
            if (err) return cb(err);
            recordCount = row.count;
            recordQuery = row.query;
            cb();
          });
      },
      function(cb) {
        if (recordCount == 1) {
          db.run(
            "update subscriptions set query = ? where email = ?2 and sub_type=?3", {
              3: subType,
              2: inputEmail,
              1: query_for_db
            },
            function(err) {
              if (err) return cb(err);
              send_mail("example", {
                insertID: this.lastID,
                subscribe_type: subType,
                uuid: UUID,
                orig_query: orig_query,
                subscribe_email: inputEmail,
                unsubscribeLink: unsubscribeLink
              });
              send_mail("subscribe", {
                insertID: this.lastID,
                subscribe_type: subType,
                uuid: UUID,
                orig_query: orig_query,
                subscribe_email: inputEmail,
                unsubscribeLink: unsubscribeLink
              });
              output = 'updated subscription';
              cb();
            });
        } else {
          db.run(
            "INSERT INTO subscriptions (email, query, uuid, sub_type) VALUES (?,?4,?2,?3)", {
              1: inputEmail,
              2: UUID,
              3: subType,
              4: query_for_db
            },
            function(err) {
              if (err) return cb(err);
              send_mail("example", {
                insertID: this.lastID,
                subscribe_type: subType,
                uuid: UUID,
                orig_query: orig_query,
                subscribe_email: inputEmail,
                unsubscribeLink: unsubscribeLink
              });
              send_mail("subscribe", {
                insertID: this.lastID,
                subscribe_type: subType,
                uuid: UUID,
                orig_query: orig_query,
                subscribe_email: inputEmail,
                unsubscribeLink: unsubscribeLink
              });
              output = 'created subscription';
              cb();
            });
        }
      }
    ],
    function(err) {
      db.close();
      callback(err, output);
    });
}

function send_mail(email_template, info) {
  var text = "";
  var html = "";
  if (info.orig_query && info.orig_query && info.subscribe_type) {
    if (email_template == "subscribe") {
      add_subscribe_template_info(info, function(template) {
        send(template, info.subscribe_email);
      });
    } else if (email_template == "example") {
      add_example_template_info(info, function(template) {
        send(template, info.subscribe_email);
      });
    }
  }
}

function send(template_info, to) {

  aws.config = {
      "region": env.get('AWS_REGION'),
      "secretAccessKey": env.get('AWS_SECRET_ACCESS_KEY'),
      "accessKeyId": env.get('AWS_ACCESS_KEY_ID')
    }
    // load AWS SES
  var ses = new aws.SES({
    apiVersion: '2010-12-01'
  });
  var send_to = [];
  send_to.push(to);
  // this must relate to a verified SES account
  var from = config.emails.from_addr;

  // this sends the email
  ses.sendEmail({
      Source: from,
      Destination: {
        ToAddresses: send_to
      },
      Message: {
        Subject: {
          Data: template_info.subject
        },
        Body: {
          Text: {
            Data: template_info.text
          },
          Html: {
            Data: template_info.html
          }

        }
      }
    },
    function(err, data) {
      if (err) throw err
      log.debug('Email sent.');
    });
}

function toWordCase(str) {

  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function add_subscribe_template_info(data, cb) {

  var template = {};
  template.text = config.emails.subscribe.text;
  template.html = config.emails.subscribe.html;

  template.text = template.text.replace(/\[{2}subscribe type\]{2}/g,
    toWordCase(data.subscribe_type));
  template.html = template.html.replace(/\[{2}subscribe type\]{2}/g,
    toWordCase(data.subscribe_type));

  template.text = template.text.replace(/\[{2}brand name\]{2}/g, data.orig_query
    .brand_name);
  template.html = template.html.replace(/\[{2}brand name\]{2}/g, data.orig_query
    .brand_name);

  template = add_footer(template, data);

  //add the specific subscription type to the subject
  template.subject = "You've been subscribed to a BE Safe " + toWordCase(data
      .subscribe_type) + " Alert!",

    cb(template);
}

function add_footer(template, data) {

  //add common footer
  template.text = template.text.concat(config.emails.footer.text);
  template.html = template.html.concat(config.emails.footer.html);
  //add the specific link to unsubscribe in the footer

  var link = data.unsubscribeLink + data.uuid;

  template.text = template.text.replace("[[unsublink]]", link);
  template.html = template.html.replace("[[unsublink]]", link);

  return template;
}

function add_example_template_info(data, cb) {

  var template = {};
  // FGH 2015-06-26 Updated to comply with new search query parameters.
  data.orig_query.skip = 0;
  data.orig_query.limit = 10;

  drugs.search(data.orig_query, function(response) {
    if (response.status !== 'success') {
      cb(new Error(response.message));
    } else {
      var db_results = response.data.results;

      //add greeting
      template.text = config.emails.example.salutation.text;
      template.html = config.emails.example.salutation.html;

      template.text += config.emails.example[data.subscribe_type].brand.text
        .replace("[[brand name]]", data.orig_query.brand_name);
      template.html += config.emails.example[data.subscribe_type].brand.html
        .replace("[[brand name]]", data.orig_query.brand_name);
      var max = (db_results.length > 3) ? 3 : db_results.length;

      if (data.subscribe_type == "recalls") {
        for (i = 0; i < max; i++) {
          template.text += config.emails.example[data.subscribe_type].row
            .text.replace("[[recall reason]]", db_results[i].reason);
          template.html += config.emails.example[data.subscribe_type].row
            .html.replace("[[recall reason]]", db_results[i].reason);
        }
      } else {
        for (i = 0; i < max; i++) {
          //html: "<p>On [[formatted date]] a [[patient age]] [[patient gender]] was [[event description]].</p>",
          template.text += formatEvent(db_results[i], "n");
          template.html += formatEvent(db_results[i], "p");
        }
      }

      template = add_footer(template, data);
      //add the specific subscription type to the subject
      template.subject = "BE Safe " + toWordCase(data.subscribe_type) +
        " Summary";
      cb(template);
    }
  });
}

function formatEvent(obj, wrapper) {
  var buf = [];

  if (typeof obj.age === 'number') {
    if (obj.age === 11 || obj.age === 8 || obj.age === 18 || (obj.age > 79 &&
        obj.age < 90)) {
      buf.push('An');
    } else {
      buf.push('A');
    }
    buf.push(obj.age);
    buf.push('year-old');
  } else {
    buf.push('A');
  }

  var child = typeof obj.age === 'number' && obj.age < 18;

  if (obj.sex === 'male') {
    if (child) {
      buf.push('boy');
    } else {
      buf.push('man');
    }
  } else if (obj.sex === 'female') {
    if (child) {
      buf.push('girl');
    } else {
      buf.push('woman');
    }
  } else {
    if (child) {
      buf.push('child');
    } else {
      buf.push('person');
    }
  }

  buf.push('experienced');
  buf.push(formatList(obj.issues) + '.');

  if (obj.drugs.length > 0) {
    buf.push('This person was taking all of the following:');
    buf.push(formatList(obj.drugs) + '.');
  }

  var out = buf.join(' ');
  if (wrapper == 'n') {
    out = out + "\n\n";
  } else if (wrapper == 'p') {
    out = "<p>" + out + "</p>";
  }

  return out;
}

function formatList(list) {
  var buf = [];
  for (var i = 0, n = list.length; i < n; i++) {
    if (i > 0) {
      if (n === 2) {
        buf.push(' and ');
      } else if (i === n - 1) {
        buf.push(', and ');
      } else {
        buf.push(', ');
      }
    }
    buf.push(list[i]);
  }
  return buf.join('');
}

function format_date(timestamp) {
  var d = new Date(timestamp);
  var date = "";

  date += d.getMonth + 1 + "/";
  date += d.getDate + "/";
  date += d.getFullYear;

  return date;
}

module.exports = {
  init: init,
  list: list,
  add_example_template_info: add_example_template_info,
  add_subscribe_template_info: add_subscribe_template_info,
  formatList: formatList,
  format_date: format_date,
  formatEvent: formatEvent,
  subscribe: subscribe,
  unsubscribe: unsubscribe,
  send_mail: send_mail
};
