'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['restangular', 'webcam', 'myApp.filters', 'myApp.services', 'myApp.directives']).
	config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
//		delete $httpProvider.defaults.headers.common['Content-Type'];

		$routeProvider
			.when('/', {templateUrl: 'partials/snapshot.html', controller: 'SnapshotCtrl'})
			.when('/add', {templateUrl: 'partials/add.html', controller: 'AddCtrl'})
			.when('/recognize', {templateUrl: 'partials/recognize.html', controller: 'RecognizeCtrl'})
			.otherwise({redirectTo: '/'});

		$locationProvider.html5Mode(true);
	}]);