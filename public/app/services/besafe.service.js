// This service provides varous methods that access the BE Safe API.
(function (module) {

    function service($q, jsend) {

        var api = {
            drugs: jsend('/drugs'),
            images: jsend('/carousel'),
            names: jsend('/carousel/terms')
        };

        // Searches for recalls or events. Returns a promise that is either
        // resolved with the response data or rejected with an error message.
        function search(query) {
            var deferred = $q.defer();
            api.drugs.get(query).then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                if (response.status === 'fail') {
                    deferred.reject('The request failed. Please check your console log.');
                } else {
                    deferred.reject(response.message);
                }
            });
            return deferred.promise;
        }

        function images() {
            var deferred = $q.defer();
            api.images.get().then(function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }

        function names() {
            var deferred = $q.defer();
            api.names.get().then(function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }

        return {
            search: search,
            images: images,
            names: names
        };
    }

    module.factory('besafe', service);
})(angular.module('app'));
