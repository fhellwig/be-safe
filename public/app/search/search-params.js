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
