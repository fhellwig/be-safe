// This service provides varous methods that access the BE Safe API.
(function(module) {

  function service($q, jsend) {

    var api = {
      version: jsend('/version'),
      drugs: jsend('/drugs'),
      images: jsend('/carousel'),
      names: jsend('/carousel/terms')
    };

    function version() {
      return api.version.get().then(function(response) {
        return response.data;
      });
    }

    // Searches for recalls or events. Returns a promise that is either
    // resolved with the response data or rejected with an error message.
    function search(query) {
      var deferred = $q.defer();
      return api.drugs.get(query).then(function(response) {
        return response.data;
      }, function(response) {
        if (response.message) {
            return response.message;
        } else {
            return 'The request failed. Please check your console log.';
        }
      });
      return deferred.promise;
    }

    function images() {
      return api.images.get().then(function(response) {
        return response.data;
      });
    }

    function names() {
      return api.names.get().then(function(response) {
        return response.data;
      });
    }

    return {
      version: version,
      search: search,
      images: images,
      names: names
    };
  }

  module.factory('besafe', service);
})(angular.module('app'));
