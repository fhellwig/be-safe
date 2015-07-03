(function (module) {

    function HeaderCtrl($scope, $state, jsend) {
        var vm = this;

        vm.version = 'unknown';

        jsend('/version').get().then(function (res) {
            vm.version = res.data;
        });

        vm.home = function () {
            $state.go('app.search', {
                type: 'recalls',
                brand: null,
                date: 'any',
                sex: null,
                age: 'any'
            }, {
                reload: true
            });
        };
    }

    module.controller('HeaderCtrl', HeaderCtrl);
})(angular.module('app'));
