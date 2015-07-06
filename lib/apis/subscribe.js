/*
 *
 * Basic /api/subscribe handler
 *
 * ver .04
 */

var subscr = require('./subscribe_funcs.js');
var log = require('../util/log')(module);

module.exports = function(router) {

  /*
   *  list route **this is a development funciton and will be removed before delivery **
   */
  router.get('/subscribe/list', function(req, res) {
    subscr.list(res);
  });

  /*
   *  subscribe route
   */
  router.put('/subscribe', function(req, res) {
    var email = req.body.email;
    var query = req.body.query;
    var unsubscribeLink = req.body.unsubscribeLink;

    subscr.subscribe(email, query, unsubscribeLink, function(err, data) {
      res.jsend(err, data);
    });
  });

  /*
   *  unsubscribe route
   */
  router.get('/subscribe/remove/:subscription_id/:uuid', function(req, res) {
    subscr.unsubscribe(req, res);
  });
};
