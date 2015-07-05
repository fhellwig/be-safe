(function () {

    var module = angular.module('app', [
        'ui.router',
        'ui.bootstrap',
        'jsend',
        'app.search',
        'app.email',
        'app.help'
    ]);

    function config($stateProvider, $urlRouterProvider, jsendProvider) {

        $stateProvider
            .state('app', {
                abstract: true,
                views: {
                    'header@': {
                        templateUrl: 'app/shared/header.html'
                    },
                    'footer@': {
                        templateUrl: 'app/shared/footer.html'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');

        jsendProvider.setRelativeBase('/api');
    }

    module.config(config);
})();
