'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('uiVideo', ['uiVideo', function() {
    return {
        restrict: 'EA',
        template: '<video ng-src="{{ videosrc }}" width="{{properties.width}}" height="{{properties.height}}" id="video" autoplay loop controls muted>',
        scope: { videosrc: '@videosrc'}
    };
  }])
  ;