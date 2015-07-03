/*
 *
 * Basic /api/subscribe handler
 *
 * ver .04
 */

var subscr = require('./subscribe_funcs.js');
var log = require('../util/log')(module);

module.exports = function (router) {

    /*
     *  list route **this is a development funciton and will be removed before delivery **
     */
    router.get('/subscribe/list', function (req, res) {
        subscr.list(res);
    });

    /*
     *  subscribe route
     */
    router.put('/subscribe/:email', function (req, res) {
        var email = req.params.email;
        var query = req.body;
        log.debug('%s is subscribing to %s for %s', email, query.search_type, query.brand_name);
        subscr.subscribe(email, query, function (err, data) {
            res.jsend(err, data);
        });
    });

    /*
     *  unsubscribe route
     */
    router.get('/subscribe/remove/:subscription_id/:uuid', function (req, res) {
        subscr.unsubscribe(req, res);
    });
};
