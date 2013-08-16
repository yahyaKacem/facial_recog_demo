'use strict';

/* Directives */
var app = angular.module('myApp.directives', []);

app.directive("prettyPrint", function(){
	return {
		restrict: "A",
		link: function($scope, $element) {
			$element.prettify({highlight : true}, $scope.data);
		}
	};
});

app.directive("recogApi", function(){
	return {
		restrict: "A",
		link: function($scope, $element) {
			var defaultParams = {
				api_key: 'ANkv85Gcu8jTcmRn',
				api_secret: 'Hq7elQKQ7zy7GaHu',
				name_space: 'poc',
				user_id: 'uverse'
			};
			var params = _.extend(defaultParams, $scope.params);
			$element.on('click', function(){
				$.ajax({
					url: 'http://rekognition.com/func/api/',
					data: params,
					cache: false,
					processData: false,
					dataType:"json",
					type: 'POST',
					success: function (data) {
						console.log(data);
					}
				});
			})
		}
	}
})
