(function (module) {

    function SubscriptionCtrl($scope, $modalInstance, jsend) {
        var vm = this;
        vm.email = null;

        vm.subscribe = function () {
            jsend('/subscribe/{0}', vm.email).put($scope.query).then(function (res) {
                $modalInstance.close();
                alert('You will now receive email notifications from BE Safe.');
            }, function (res) {
                $modalInstance.close();
                alert('There was an error requesting the subscription.\n\n' + res.message);
            });
        };

        vm.cancel = function () {
            $modalInstance.dismiss();
        };
    }

    module.controller('SubscriptionCtrl', SubscriptionCtrl);
})(angular.module('app.search'));
