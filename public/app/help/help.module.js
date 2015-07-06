(function () {
    var module = angular.module('app.help', []);

    function config($stateProvider) {
        $stateProvider
            .state('app.help', {
                url: '/help',
                views: {
                    'content@': {
                        templateUrl: 'app/help/user-guide.html'
                    }
                }
            });
    }

    module.config(config);
})();