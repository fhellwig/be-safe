(function (module) {

    function SearchCtrl($scope, $http, $modal, $state, $stateParams, jsend) {
        var vm = this;

        var defaults = {
            request: {
                criteria: {}
            },
            response: {
                status: 'success',
                data: {
                    total: 0,
                    results: []
                }
            }
        };

        vm.states = {
            initial: 0,
            searching: 1,
            success: 2,
            failure: 3
        };

        vm.options = {
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

        vm.first = function () {
            return vm.criteria.skip + 1
        };

        vm.last = function () {
            return Math.min(vm.criteria.skip + vm.criteria.limit, vm.response.data.total);
        };

        vm.total = function () {
            return vm.response.data.total;
        };

        vm.atBeginning = function () {
            return vm.criteria.skip === 0;
        };

        vm.atEnd = function () {
            return vm.last() >= vm.response.data.total;
        };

        vm.prev = function () {
            vm.criteria.skip -= vm.criteria.limit;
            $state.go('app.search', vm.criteria);
            //doSearch(vm.criteria);
        };

        vm.next = function () {
            vm.criteria.skip += vm.criteria.limit;
            $state.go('app.search', vm.criteria);
            //doSearch(vm.criteria);
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
            angular.forEach(r.patient.reaction, function (issue) {
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

        vm.search = function () {
            vm.criteria.skip = 0;
            $state.go('app.search', vm.criteria, {
                reload: true
            });
        }

        function doSearch(criteria) {
            vm.request = angular.copy(criteria);
            vm.response = angular.copy(defaults.response);
            var query = createQuery(criteria);
            vm.state = vm.states.searching;
            jsend('/drugs').get(query).then(function (response) {
                vm.response = response;
                vm.state = vm.states.success;
            }, function (res) {
                vm.response = response;
                vm.state = vm.states.failure;
            });
        };

        vm.subscribe = function () {
            $scope.query = createQuery(vm.criteria);
            $modal.open({
                templateUrl: 'app/search/subscribe.html',
                controller: 'SubscriptionCtrl as vm',
                scope: $scope
            });
        };

        vm.report = function (report) {

            $scope.report = report;
            $scope.query = createQuery(vm.criteria);
            $modal.open({
                templateUrl: 'app/search/report.html',
                controller: 'ReportCtrl as vm',
                scope: $scope
            });
        };

        vm.clear = function () {
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
            var opt = vm.options[name][val];
            return opt ? val : def;
        }

        vm.criteria = {
            brand: strParam('brand'),
            type: optParam('type', 'recalls'),
            age: optParam('age', 'any'),
            date: optParam('date', 'any'),
            sex: optParam('sex', 'any'),
            skip: intParam('skip', 0),
            limit: intParam('limit', 10)
        };

        if (vm.criteria.brand) {
            doSearch(vm.criteria);
            vm.shareLinks = {
                twitter: 'https://twitter.com/share?source=tweetbutton&url=' + encodeURIComponent(window.location.href),
                // Note: Facebook does not handle URLs with a hash.
                // The only way this can be handled is by switching the app
                // to HTML5 mode instead of routing with hashes.
                facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + window.location.origin
            }
        } else {
            vm.response = angular.copy(defaults.response);
            vm.state = vm.states.initial;
        }

        // Get the search terms for typeahead.
        vm.searchTerms = [];
        jsend('/carousel/terms').get().then(function (response) {
            vm.searchTerms = response.data;
        });
        vm.typeaheadContains = function (str, val) {
            return str.indexOf(val.toLowerCase()) >= 0;
        };
        vm.typeaheadSelected = function (term) {
            vm.criteria.brand = term;
            vm.search();
        };

        vm.share = function (result) {
            vm.shared = result;
        };

        vm.shared = null;
    }

    module.controller('SearchCtrl', SearchCtrl);
})(angular.module('app.search'));
