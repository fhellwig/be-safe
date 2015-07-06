(function(module) {

  function SubscriptionCtrl($scope, $state, $modalInstance, besafe) {
    var vm = this;
    vm.email = null;

    vm.subscribe = function() {
      var unsubscribeLink = $state.href('app.email.unsubscribe', null, {
        absolute: true
      });
      besafe.subscribe(vm.email, $scope.query, unsubscribeLink).then(
        function(response) {
          $modalInstance.close();
          alert(
            'You will now receive email notifications from BE Safe.');
        },
        function(response) {
          $modalInstance.close();
          alert('There was an error requesting the subscription.\n\n' +
            response.message);
        }
      );
    };

    vm.cancel = function() {
      $modalInstance.dismiss();
    };
  }

  module.controller('SubscriptionCtrl', SubscriptionCtrl);
})(angular.module('app.search'));
