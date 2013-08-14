'use strict';

/* Directives */
var app = angular.module('myApp.directives', []);

app.directive("testButton", function(){
	return {
		restrict: "A",
		scope: true,
		link: function($scope, $element) {

		}
	};
});
