// This service provides varous methods that access the BE Safe API.
(function(module) {

  function service($q, jsend) {

    var api = {
      version: jsend('/version'),
      drugs: jsend('/drugs'),
      images: jsend('/carousel'),
      names: jsend('/carousel/terms'),
      subscribe: jsend('/subscribe'),
      unsubscribe: function(uuid) {
        return jsend('/subscribe/{0}', uuid);
      }
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
          return $q.reject(
            'The request failed. Please check your browser log.');
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

    function subscribe(email, query, unsubscribeLink) {
      return api.subscribe.put({
        email: vm.email,
        query: $scope.query,
        unsubscribeLink: unsubscribeLink
      }).then(
        function(response) {
          return 'You will now receive email notifications from BE Safe.';
        },
        function(response) {
          return $q.reject(
            'There was an error requesting the subscription.\n\n' +
            response.message);
        });
    }

    function unsubscribe(uuid) {
      return api.unsubscribe(uuid).delete().then(
        function(response) {
          return 'Unsubscribed';
        },
        function(response) {
          return $q.reject('Error: ' + response.code +
            ' (' + response.message + ')');
        });
    }

    return {
      version: version,
      search: search,
      images: images,
      names: names,
      subscribe: subscribe,
      unsubscribe: unsubscribe
    };
  }

  module.factory('besafe', service);
})(angular.module('app'));
