(function () {

    var module = angular.module('app', [
        'ui.router',
        'ui.bootstrap',
        'jsend',
        'app.search',
        'app.help'
    ]);

    function config($stateProvider, $urlRouterProvider, jsendProvider) {

        $stateProvider
            .state('app', {
                abstract: true,
                views: {
                    'header@': {
                        templateUrl: 'app/shared/header.html'
                    },
                    'footer@': {
                        templateUrl: 'app/shared/footer.html'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');

        jsendProvider.setRelativeBase('/api');
    }

    module.config(config);
})();

(function () {
    var module = angular.module('app.help', []);

    function config($stateProvider) {
        $stateProvider
            .state('app.help', {
                url: '/help',
                views: {
                    'content@': {
                        templateUrl: 'app/help/user-guide.html'
                    }
                }
            });
    }

    module.config(config);
})();
(function () {
    var module = angular.module('app.search', []);

    function config($stateProvider) {
        $stateProvider
            .state('app.search', {
                url: '/?type&brand&date&sex&age&skip&limit',
                views: {
                    'content@': {
                        templateUrl: 'app/search/search.html'
                    }
                }
            });
    }

    module.config(config);
})();

(function (module) {

    function beSafeCarousel($rootScope, $state, $stateParams, $animate, besafe) {
        $animate.enabled(true);
        var self = this;
        var images = null;
        var selected = null;
        var interval;
        var $scope;

        $rootScope.$on('$stateChangeSuccess', function (event, state, params) {
            selectFromParams(params);
        });

        function selectFromParams(params) {
            if (params && params.brand) {
                var found = false;
                angular.forEach(images, function (image) {
                    image.active = false;
                    if (image.term == params.brand) {
                        image.active = true;
                        selected = image;
                        found = true;
                    }
                });
                if (found) {
                    $scope.interval = -1;
                } else {
                    $scope.interval = interval;
                }
            }
        }

        function selectImage(image) {
            if (selected) {
                selected.active = false;
            }
            selected = image;
            selected.active = true;
            var params = angular.copy($stateParams);
            params.brand = image.term;
            params.skip = 0;
            $state.go('app.search', params, {
                reload: true
            });
        }

        function link(scope, element, attrs) {
            $scope = scope;
            scope.interval = interval = scope.seconds * 1000;
            if (images === null) {
                besafe.images().then(function (results) {
                    images = results;
                    if (images.length > 0) {
                        images[0].active = true;
                    }
                    selectFromParams($stateParams);
                    scope.images = images;
                });
            } else {
                scope.images = images;
                selectFromParams($stateParams);
            }
            scope.selectImage = selectImage;
        }

        return {
            restrict: 'E',
            scope: {
                seconds: '='
            },
            link: link,
            templateUrl: 'app/carousel/be-safe-carousel.html'
        };
    }

    module.directive('beSafeCarousel', beSafeCarousel);

})(angular.module('app.search'));

(function (module) {

    function formatDate(timestamp) {
        var date = new Date(timestamp);
        return date.toLocaleDateString();
    }

    function formatEvent(obj) {
        var buf = [];

        if (typeof obj.age === 'number') {
            if (obj.age === 11 || obj.age === 8 || obj.age === 18 || (obj.age > 79 && obj.age < 90)) {
                buf.push('An');
            } else {
                buf.push('A');
            }
            buf.push(obj.age);
            buf.push('year-old');
        } else {
            buf.push('A');
        }

        var child = typeof obj.age === 'number' && obj.age < 18;

        if (obj.sex === 'male') {
            if (child) {
                buf.push('boy');
            } else {
                buf.push('man');
            }
        } else if (obj.sex === 'female') {
            if (child) {
                buf.push('girl');
            } else {
                buf.push('woman');
            }
        } else {
            if (child) {
                buf.push('child');
            } else {
                buf.push('person');
            }
        }

        buf.push('experienced');
        buf.push(formatList(obj.issues) + '.');

        if (obj.drugs.length > 0) {
            buf.push('This person was taking all of the following:');
            buf.push(formatList(obj.drugs) + '.');
        }

        return buf.join(' ');
    }

    function formatList(list) {
        var buf = [];
        for (var i = 0, n = list.length; i < n; i++) {
            if (i > 0) {
                if (n === 2) {
                    buf.push(' and ');
                } else if (i === n - 1) {
                    buf.push(', and ');
                } else {
                    buf.push(', ');
                }
            }
            buf.push(list[i]);
        }
        return buf.join('');
    }

    module.filter('timestamp', function () {
        return formatDate;
    });

    module.filter('event', function () {
        return formatEvent;
    });

})(angular.module('app.search'));

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

(function(module) {

  function searchParams($stateParams) {

    var options = {
      date: {
        any: {
          days: null,
          text: 'All date ranges'
        },
        past30d: {
          days: 30,
          text: 'Past 30 days'
        },
        past60d: {
          days: 60,
          text: 'Past 60 days'
        },
        past90d: {
          days: 90,
          text: 'Past 90 days'
        },
        past12m: {
          days: 365,
          text: 'Past twelve months'
        },
        past5y: {
          days: 5 * 365,
          text: 'Past five years'
        }
      },
      type: {
        recalls: 'recalls',
        events: 'events'
      },
      sex: {
        any: {
          value: null,
          text: 'Both'
        },
        male: {
          value: 'm',
          text: 'Male'
        },
        female: {
          value: 'f',
          text: 'Female'
        }
      },
      age: {
        any: {
          min: 0,
          max: 200,
          text: 'All age groups'
        },
        infant: {
          min: 0,
          max: 4,
          text: 'Children 0 to 4'
        },
        child: {
          min: 5,
          max: 12,
          text: 'Children 5 to 12'
        },
        teen: {
          min: 13,
          max: 17,
          text: 'Teens 13 to 17'
        },
        young: {
          min: 18,
          max: 25,
          text: 'Adults 18 to 25'
        },
        adult: {
          min: 26,
          max: 39,
          text: 'Adults 26 to 39'
        },
        mid: {
          min: 40,
          max: 55,
          text: 'Adults 40 to 55'
        },
        older: {
          min: 56,
          max: 69,
          text: 'Adults 56 to 69'
        },
        elderly: {
          min: 70,
          max: 200,
          text: 'Adults 70+'
        }
      }
    };

    function intParam(name, def) {
      var val = parseInt($stateParams[name]);
      return isNaN(val) ? def : val;
    }

    function strParam(name, def) {
      var val = $stateParams[name];
      val = val || def || '';
      return val.trim().toLowerCase();
    }

    function optParam(name, def) {
      var val = $stateParams[name];
      var opt = options[name][val];
      return opt ? val : def;
    }

    function criteria() {
      return {
        brand: strParam('brand'),
        type: optParam('type', 'recalls'),
        age: optParam('age', 'any'),
        date: optParam('date', 'any'),
        sex: optParam('sex', 'any'),
        skip: intParam('skip', 0),
        limit: intParam('limit', 10)
      };
    }

    return {
      options: options,
      criteria: criteria
    };
  }

  module.factory('searchParams', searchParams);
})(angular.module('app.search'));

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
