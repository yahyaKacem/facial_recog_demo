'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['restangular', 'myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/add.html', controller: 'AddCtrl'});
    $routeProvider.when('/recognize', {templateUrl: 'partials/recognize.html', controller: 'RecognizeCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);