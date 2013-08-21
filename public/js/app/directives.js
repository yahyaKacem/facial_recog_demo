'use strict';

/* Directives */
var app = angular.module('myApp.directives', []);

app.directive("prettyPrint", function(){
	return {
		restrict: "A",
		link: function($scope, $element, $attrs) {
			$attrs.$observe('data', function(value) {
				if (value) {
					$element.prettify({highlight : true}, $attrs.data);
				}
			});
		}
	};
});

app.directive("recogApi", function(){
	return {
		restrict: "A",
		link: function($scope, $element) {
			$scope.showError = false;
			$scope.showSuccess = false;
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
					dataType:"json",
					type: 'POST',
					error: function(er) {
						$scope.showError = true;
						$scope.error = er;
					},
					success: function (data) {
						$scope.$digest();
						$scope.data = data;
						$scope.showSuccess = true;
					}
				});
			})
		}
	}
})
