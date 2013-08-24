'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['restangular', 'webcam', 'ui.state', 'myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',  function($routeProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
//		delete $httpProvider.defaults.headers.common['Content-Type'];
		// For any unmatched url, send to /
		$urlRouterProvider.otherwise("/")

    $routeProvider.when('/', {templateUrl: 'partials/snapshot.html', controller: 'SnapshotCtrl'});
		$routeProvider.when('/add', {templateUrl: 'partials/add.html', controller: 'AddCtrl'});
    $routeProvider.when('/recognize', {templateUrl: 'partials/recognize.html', controller: 'RecognizeCtrl'});
    $locationProvider.html5Mode(true);
  }]);