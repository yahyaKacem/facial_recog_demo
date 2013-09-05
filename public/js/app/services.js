'use strict';

/* Services */
var app = angular.module('myApp.services', []);

/**
 * Saves canvas image to server
 */
app.service('localImageService', function ($http, $rootScope, $location, $q, promiseTracker) {
	return {
		save: function (canvas, name) {
			$rootScope.savingImage = promiseTracker('saving-image');
			var dataURL = encodeURIComponent(canvas.toDataURL("image/png"));
			var url = "/camera/" + name + "/";

			var config = {
				method: 'POST',
				url: url,
				data: $.param({ image: dataURL }),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				tracker: 'saving-image'
			};

			var deferred = $q.defer();

			$http(config).
				success(function (data) {
					deferred.resolve(data);
					console.log('Successful localImageSaveService response!', data);
				}).
				error(function (data) {
					deferred.reject(data);
					console.log('Failed localImageSaveService response.', data);
				});
			return deferred.promise;
		},
		delete: function() {
			var deferred = $q.defer();
			$http({method: 'GET', url: "/camera/delete/"}).
				success(function (data) {
					deferred.resolve(data);
					console.log('Images deleted', data);
				}).
				error(function (data) {
					deferred.reject(data);
					console.log('Failed to delete images', data);
				});
			return deferred.promise;
		}
	}
});

/**
 * Restangular ReKognition service
 * http://rekognition.com/func/api/?api_key={api_key}&api_secret={api_secret}&jobs={jobs}&urls={urls}
 * API Docs: http://v2.rekognition.com/developer/docs
 */
app.service('rekognitionService', function ($http, $q, $rootScope, $location, promiseTracker) {
	return {
		get: function (params) {
			$rootScope.loadingRekog = promiseTracker('loading-rekog');
			var defaultParams = {
				api_key: 'ANkv85Gcu8jTcmRn',
				api_secret: 'Hq7elQKQ7zy7GaHu',
				name_space: 'poc',
				user_id: 'uverse'
			};

			// hard coding image url if running on localhost for testing
			params.urls = $location.host() == 'localhost'
				? 'http://farm3.static.flickr.com/2566/3896283279_0209be7a67.jpg'
				: params.urls;

			_.extend(params, defaultParams);

			var config = {
				method: 'GET',
				url: 'http://rekognition.com/func/api/',
				params: params,
				headers: {
					'contentType': false
				},
				tracker: 'loading-rekog'
			};

			var deferred = $q.defer();

			$http(config).
				success(function (data) {
					deferred.resolve(data);
					console.log('Successful rekognitionService response!', data);
				}).
				error(function (data) {
					deferred.reject();
					console.log('Failed rekognitionService response.', data);
				});
			return deferred.promise;
		}
	}
});

app.factory('apiResponseFactory', function () {
	return {
		'response': {}
	};
});

app.factory('apiRequestFactory', function () {
	return {
		'request': {}
	};
});

app.factory('formFactory', function () {
	return {
		'data': {
			firstname: '',
			lastname: ''
		}
	};
});