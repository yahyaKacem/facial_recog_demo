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
