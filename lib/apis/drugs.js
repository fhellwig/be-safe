var drugs = require('../search/drugs');

module.exports = function (router) {

    /*
     * Searches the events endpoint given the following query parameters:
     *
     * skip         (number)    required
     * limit        (number)    required   
     * search_type  (string)    required ('recalls' | 'events')
     * brand_name   (string)    required
     * offset_days  (string)    optional
     * sex          ('m' | 'f') optional (both are assumed if not provided)
     * min_age      (number)    optional
     * max_age      (number)    required only if min_age is also specified
     */
    router.get('/drugs', function getDrugs(req, res, next) {
        drugs.search(req.query, function (response) {
            res.send(response);
        });
    });
};
