// This service provides varous methods that access the BE Safe API.
(function(module) {

  function service($q, strformat, jsend) {

    function version() {
      return jsend({
        method: 'GET',
        url: '/api/version'
      }).then(
        function(response) {
          return response.data;
        }
      );
    }

    // Searches for recalls or events. Returns a promise that is either
    // resolved with the response data or rejected with an error message.
    function search(query) {
      return jsend({
        method: 'GET',
        url: '/api/drugs',
        params: query
      }).then(
        function(response) {
          return response.data;
        },
        function(response) {
          alert(
            'The search request failed. Please check your browser log.'
          );
        }
      );
    }

    function images() {
      return jsend({
        method: 'GET',
        url: '/api/carousel'
      }).then(
        function(response) {
          return response.data;
        }
      );
    }

    // Gets the drug names (search terms)
    function names() {
      return jsend({
        method: 'GET',
        url: '/api/carousel/terms'
      }).then(
        function(response) {
          return response.data;
        }
      );
    }

    function subscribe(email, query, unsubscribeLink) {
      return jsend({
        method: 'PUT',
        url: '/api/subscribe',
        data: {
          email: email,
          query: query,
          unsubscribeLink: unsubscribeLink
        }
      }).then(
        function(response) {
          return
            'You will now receive email notifications from BE Safe.';
        },
        function(response) {
          return $q.reject(
            'There was an error requesting the subscription.\n\n' +
            response.message);
        }
      );
    }

    function unsubscribe(uuid) {
      return jsend({
        method: 'DELETE',
        url: '/api/subscriptions/' + uuid
      }).then(
        function(response) {
          return response.data;
        },
        function(response) {
          return $q.reject(response.message);
        }
      );
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
