(function(module) {

  function UnsubscribeCtrl($scope, $stateParams, $location) {
    var vm = this;
    console.log($location);
    vm.uuid = $stateParams.uuid;
  }

  module.controller('UnsubscribeCtrl', UnsubscribeCtrl);
})(angular.module('app.email'));
