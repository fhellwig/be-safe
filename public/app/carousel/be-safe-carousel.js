(function (module) {

  function beSafeCarousel($state, $stateParams, $animate, besafe) {
    $animate.enabled(true);
    var self = this;
    var images = null;
    var selected = null;
    var interval;
    var $scope;

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
