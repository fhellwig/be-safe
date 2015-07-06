module.exports = function (router) {
    router.get('/headers', function (req, res) {
        res.jsend.success(req.headers);
    });
};
