(function(module) {

    function ReportCtrl($scope, $modalInstance, $http) {
        var vm = this;
        vm.query = $scope.query;
        vm.results = $scope.report;
        vm.email = null;
        vm.complaint = null;

        vm.report = function() {

            var temp = {
                email: vm.email,
                complaint: vm.complaint,
                query: vm.query,
                report: vm.results
            };
            $http({
                method: 'post',
                url: '/api/reports',
                data: temp
            }).then(function(res) {
                $modalInstance.close();
                alert('Your adverse reaction has been reported.');
            }, function(res) {
                var error;
                if(res.status === 0) {
                    error = 'The Internet connection appears to be offline.';
                } else {
                    error = res.statusText;
                }
                $modalInstance.close();
                alert('There was an error in submitting your report.\n\n' + error);
            });
        };

        vm.clear = function () {
            if (vm.checked === false) {
                vm.email = null;
            }
        }

        vm.cancel = function() {
            $modalInstance.dismiss();
        };
    }

    module.controller('ReportCtrl', ReportCtrl);
})(angular.module('app.search'));
