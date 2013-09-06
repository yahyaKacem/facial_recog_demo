'use strict';

angular.module('myApp', ['webcam', 'angularytics', 'ajoslin.promise-tracker', 'myApp.filters', 'myApp.services', 'myApp.directives']).
	config(['$routeProvider', '$locationProvider', '$httpProvider', 'AngularyticsProvider', function ($routeProvider, $locationProvider, $httpProvider, AngularyticsProvider) {
		AngularyticsProvider.setEventHandlers(['Console', 'Google']);
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

		$routeProvider
			.when('/', {templateUrl: 'partials/about.html', controller: 'AboutCtrl'})
			.when('/wrong_browser', {templateUrl: 'partials/wrong_browser.html', controller: 'WrongBrowserCtrl'})
			.when('/snapshot', {templateUrl: 'partials/snapshot.html', controller: 'SnapshotCtrl'})
			.when('/add', {templateUrl: 'partials/review.html', controller: 'AddCtrl'})
			.when('/add_response', {templateUrl: 'partials/response.html', controller: 'AddResponseCtrl'})
			.when('/train', {templateUrl: 'partials/response.html', controller: 'TrainCtrl'})
			.when('/new_snapshot', {templateUrl: 'partials/new_snapshot.html', controller: 'NewSnapshotCtrl'})
			.when('/recognize', {templateUrl: 'partials/review.html', controller: 'RecognizeCtrl'})
			.when('/recognize_response', {templateUrl: 'partials/response.html', controller: 'RecognizeResponseCtrl'})
			.otherwise({redirectTo: '/'});

		$locationProvider.html5Mode(true);
	}]).
	run(function(Angularytics) {
		Angularytics.init();
	});