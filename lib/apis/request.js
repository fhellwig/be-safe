module.exports = function (router) {
    router.get('/headers', function (req, res) {
        res.jsend.success(req.headers);
    });
};

module.exports = function (router) {
    router.get('/port', function (req, res) {
        res.jsend.success(process.env.PORT || 'not set');
    });
};
