(function() {
  var module = angular.module('app.search', []);

  function config($stateProvider) {
    $stateProvider
      .state('app.search', {
        url: '/?type&brand&date&sex&age&skip&limit',
        views: {
          'content@': {
            templateUrl: 'app/search/search.html'
          }
        }
      });
  }

  module.config(config);
})();
