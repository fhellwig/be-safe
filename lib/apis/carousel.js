var fs = require('fs');
var pkg = require('pkgfinder')();

module.exports = function (router) {

    router.get('/carousel', function (req, res) {
        var file = fs.readFileSync(pkg.resolve('data/carousel/carousel.json'), 'utf8');
        var slides = shuffle(JSON.parse(file));
        slides.forEach(function (slide) {
            slide.file = 'carousel/' + slide.file;
        });
        res.jsend.success(slides);
    });

    router.get('/carousel/terms', function (req, res) {
        var file = fs.readFileSync(pkg.resolve('data/carousel/carousel.json'), 'utf8');
        var terms = JSON.parse(file).map(function (slide) {
            return slide.term;
        });
        res.jsend.success(terms.sort());
    });
};

// Ref: http://bost.ocks.org/mike/shuffle/
function shuffle(array) {
    var m = array.length,
        t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}
