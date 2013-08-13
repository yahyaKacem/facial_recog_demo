'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('uiVideo', ['uiVideo', function() {
    return {
        restrict: 'EA',
        template: '<video ng-src="{{ videosrc }}" width="{{properties.width}}" height="{{properties.height}}" id="video" autoplay loop controls muted>',
        scope: { videosrc: '@videosrc'}
    };
  }]);