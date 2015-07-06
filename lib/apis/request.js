module.exports = function (router) {
    router.get('/headers', function (req, res) {
        res.jsend.success(req.headers);
    });

    router.get('/port', function (req, res) {
        res.jsend.success(process.env.PORT || 'not set');
    });
};
