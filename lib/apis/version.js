var pkg = require('pkgfinder')();

module.exports = function (router) {
    router.get('/version', function (req, res) {
        res.jsend.success(pkg.version);
    });
};
