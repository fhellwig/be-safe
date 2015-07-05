(function(module) {

  function SearchCtrl($scope, $http, $modal, $state, $stateParams,
    searchParams, besafe, jsend) {
    var vm = this;
    var total = 0;

    vm.request = null;
    vm.results = null;
    vm.message = null;
    vm.waiting = false;
    vm.options = searchParams.options;
    vm.criteria = searchParams.criteria();

    vm.first = function() {
      return vm.criteria.skip + 1
    };

    vm.last = function() {
      return Math.min(vm.criteria.skip + vm.criteria.limit, total);
    };

    vm.total = function() {
      return total;
    };

    vm.atBeginning = function() {
      return vm.criteria.skip === 0;
    };

    vm.atEnd = function() {
      return vm.last() >= total;
    };

    vm.prev = function() {
      vm.criteria.skip -= vm.criteria.limit;
      $state.go('app.search', vm.criteria, {
        notify: false
      });
      doSearch(vm.criteria);
    };

    vm.next = function() {
      vm.criteria.skip += vm.criteria.limit;
      $state.go('app.search', vm.criteria, {
        notify: false
      });
      doSearch(vm.criteria);
    };

    function resultString(r) {
      var s = [];
      s.push('A ');
      if (r.patient.patientonsetage) {
        s.push(Math.round(r.patient.patientonsetage));
        s.push(' year-old ');
      }
      if (r.patient.patientsex) {
        if (r.patient.patientsex == 1) {
          s.push('male ');
        } else {
          s.push('female ');
        }
      } else {
        s.push('patient ');
      }
      s.push('experienced the following issues: ');
      var tmp = [];
      angular.forEach(r.patient.reaction, function(issue) {
        tmp.push(issue.reactionmeddrapt.toLowerCase());
      });
      s.push(tmp.join(', '));
      s.push('.');
      return s.join('');
    }

    function createQuery(criteria) {
      var query = {
        search_type: criteria.type,
        brand_name: criteria.brand,
        skip: criteria.skip,
        limit: criteria.limit
      };
      if (vm.options.date[criteria.date].days) {
        query.offset_days = vm.options.date[criteria.date].days;
      }
      if (vm.options.sex[criteria.sex].value) {
        query.sex = vm.options.sex[criteria.sex].value;
      }
      query.min_age = vm.options.age[criteria.age].min;
      query.max_age = vm.options.age[criteria.age].max;
      return query;
    }

    vm.search = function() {
      vm.criteria.skip = 0;
      $state.go('app.search', vm.criteria, {
        reload: true
      });
    }

    function doSearch(criteria) {
      var query = createQuery(criteria);
      vm.request = angular.copy(criteria);
      vm.waiting = true;
      besafe.search(query).then(function(data) {
        total = data.total;
        vm.results = data.results;
      }, function(message) {
        total = 0;
        vm.request = null;
        vm.results = null;
        vm.message = message;
      }).finally(function() {
        vm.waiting = false;
      });
    }

    vm.subscribe = function() {
      $scope.query = createQuery(vm.criteria);
      $modal.open({
        templateUrl: 'app/search/subscribe.html',
        controller: 'SubscriptionCtrl as vm',
        scope: $scope
      });
    };

    vm.report = function(report) {

      $scope.report = report;
      $scope.query = createQuery(vm.criteria);
      $modal.open({
        templateUrl: 'app/search/report.html',
        controller: 'ReportCtrl as vm',
        scope: $scope
      });
    };

    vm.clear = function() {
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

    if (vm.criteria.brand) {
      doSearch(vm.criteria);
      vm.shareLinks = {
        twitter: 'https://twitter.com/share?source=tweetbutton&url=' +
          encodeURIComponent(window.location.href),
        // Note: Facebook does not handle URLs with a hash.
        // The only way this can be handled is by switching the app
        // to HTML5 mode instead of routing with hashes.
        facebook: 'https://www.facebook.com/sharer/sharer.php?u=' +
          window.location.origin
      }
    } else {
      vm.message = null;
      vm.request = null;
      vm.results = null;
    }

    // Get the search terms for typeahead.
    vm.searchTerms = [];
    besafe.names().then(function(names) {
      vm.searchTerms = names;
    });
    vm.typeaheadContains = function(str, val) {
      return str.indexOf(val.toLowerCase()) >= 0;
    };
    vm.typeaheadSelected = function(term) {
      vm.criteria.brand = term;
      vm.search();
    };

    vm.share = function(result) {
      vm.shared = result;
    };

    vm.shared = null;
  }

  module.controller('SearchCtrl', SearchCtrl);
})(angular.module('app.search'));
