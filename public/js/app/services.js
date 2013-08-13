'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).

// Restangular ReKognition service
// http://rekognition.com/func/api/?api_key={api_key}&api_secret={api_secret}&jobs={jobs}&urls={urls}
// API Docs: http://v2.rekognition.com/developer/docs
factory('ReKognition', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setBaseUrl('http://rekognition.com/func/api');
    var defaultParams = {
      api_key: 'ANkv85Gcu8jTcmRn',
      api_secret: 'Hq7elQKQ7zy7GaHu',
      name_space: 'poc'
    };
    RestangularConfigurer.setDefaultRequestParams(defaultParams);
  });
});