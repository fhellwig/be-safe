(function (module) {

    function formatDate(timestamp) {
        var date = new Date(timestamp);
        return date.toLocaleDateString();
    }

    function formatEvent(obj) {
        var buf = [];

        if (typeof obj.age === 'number') {
            if (obj.age === 11 || obj.age === 8 || obj.age === 18 || (obj.age > 79 && obj.age < 90)) {
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

        return buf.join(' ');
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

    module.filter('timestamp', function () {
        return formatDate;
    });

    module.filter('event', function () {
        return formatEvent;
    });

})(angular.module('app.search'));
