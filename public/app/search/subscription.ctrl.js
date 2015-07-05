(function(module) {

  function SubscriptionCtrl($scope, $state, $modalInstance, jsend) {
    var vm = this;
    vm.email = null;

    vm.subscribe = function() {
      var unsubscribeLink = $state.href('app.email.unsubscribe', null, {
        absolute: true
      });
      jsend('/subscribe').put({
        email: vm.email,
        query: $scope.query,
        unsubscribeLink: unsubscribeLink
      }).then(function(
        res) {
        $modalInstance.close();
        alert(
          'You will now receive email notifications from BE Safe.');
      }, function(res) {
        $modalInstance.close();
        alert('There was an error requesting the subscription.\n\n' +
          res.message);
      });
    };

    vm.cancel = function() {
      $modalInstance.dismiss();
    };
  }

  module.controller('SubscriptionCtrl', SubscriptionCtrl);
})(angular.module('app.search'));
