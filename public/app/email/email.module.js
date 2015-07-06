(function() {
  var module = angular.module('app.email', []);

  function config($stateProvider) {
    $stateProvider
      .state('app.email', {
        abstract: true,
        url: '/email'
      })
      .state('app.email.unsubscribe', {
        url: '/unsubscribe/:uuid',
        views: {
          'content@': {
            templateUrl: 'app/email/unsubscribe.html'
          }
        }
      });
  }

  module.config(config);
})();
