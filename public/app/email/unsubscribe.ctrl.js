(function(module) {

  function UnsubscribeCtrl($stateParams, besafe) {
    var vm = this;
    vm.uuid = $stateParams.uuid;
    vm.success = '';
    vm.error = '';

    besafe.unsubscribe(vm.uuid).then(function(status) {
      vm.success = status;
    }, function(status) {
      vm.error = status;
    });
  }

  module.controller('UnsubscribeCtrl', UnsubscribeCtrl);
})(angular.module('app.email'));
