'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var app = angular.module('myApp.services', []);

// Restangular ReKognition service
// http://rekognition.com/func/api/?api_key={api_key}&api_secret={api_secret}&jobs={jobs}&urls={urls}
// API Docs: http://v2.rekognition.com/developer/docs
app.factory('rekognitionFactory', function($http, $q) {
  return function() {
	  var defaultParams = {
		  api_key: 'ANkv85Gcu8jTcmRn',
		  api_secret: 'Hq7elQKQ7zy7GaHu',
		  name_space: 'poc',
		  user_id: 'uverse'
	  };
	  var params = _.extend(defaultParams, $scope.params);
	  console.log(params);
		  $.ajax({
			  url: 'http://rekognition.com/func/api/',
			  data: params,
			  cache: false,
			  dataType:"json",
			  type: 'POST',
			  success: function (data) {
				  console.log(data);
			  }
		  });
  }
});

app.factory('apiresponseFactory', function() {
	return {
		'response' : {}
	};
});

app.factory('apirequestFactory', function() {
	return {
		'request' : {}
	};
});

app.factory('formFactory', function() {
	return {
		'data' : {
			firstname : '',
			lastname : ''
		}
	};
});