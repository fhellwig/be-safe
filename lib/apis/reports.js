var store = require('./storeReportsDB.js');

module.exports = function (router) {
    router.get('/reports/list', function (req, res) {
        store.list(res);
    });

    router.post('/reports', function (req, res) {
        store.storeData(req, res);
    });
};
