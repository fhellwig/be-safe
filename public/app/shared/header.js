(function(module) {

  function HeaderCtrl($scope, $state, besafe) {
    var vm = this;

    vm.version = 'unknown';

    besafe.version().then(function(version) {
      vm.version = version;
    });

    vm.isCollapsed = true;
  }

  module.controller('HeaderCtrl', HeaderCtrl);
})(angular.module('app'));
