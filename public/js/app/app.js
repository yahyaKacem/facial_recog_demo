'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['restangular', 'webcam', 'myApp.filters', 'myApp.services', 'myApp.directives']).
	config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
//		delete $httpProvider.defaults.headers.common['Content-Type'];

		$routeProvider
			.when('/', {templateUrl: 'partials/snapshot.html', controller: 'SnapshotCtrl'})
			.when('/add', {templateUrl: 'partials/add.html', controller: 'AddCtrl'})
			.when('/add_response', {templateUrl: 'partials/add_response.html', controller: 'AddResponseCtrl'})
			.when('/train', {templateUrl: 'partials/train.html', controller: 'TrainCtrl'})
			.when('/new_snapshot', {templateUrl: 'partials/new_snapshot.html', controller: 'NewSnapshotCtrl'})
			.when('/recognize', {templateUrl: 'partials/recognize.html', controller: 'RecognizeCtrl'})
			.when('/recognize_response', {templateUrl: 'partials/recognize_response.html', controller: 'RecognizeResponseCtrl'})
			.otherwise({redirectTo: '/'});

		$locationProvider.html5Mode(true);
	}]);