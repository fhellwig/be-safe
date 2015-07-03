(function () {

    var module = angular.module('app', [
        'ui.router',
        'ui.bootstrap',
        'jsend',
        'app.search',
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
        jsendProvider.setResponseCallback(function (response) {
            if (response.status === 'error') {
                alert(response.message);
            }
        });
    }

    module.config(config);
})();
