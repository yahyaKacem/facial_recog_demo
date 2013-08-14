'use strict';

/* Directives */
var app = angular.module('myApp.directives', []);

app.directive("startButton", function(){
	return {
		restrict: "A",
		scope: true,
		link: function($scope, $element) {
			$scope.takepicture = false;
			$element.bind('click', function(){
				$scope.takepicture = true;
			});
		}
	};
});

app.directive("webVideo", function(){
	return {
		restrict: "A",
		scope: true,
		link: function($scope, $element) {
			var streaming;
			$scope.height = $element.videoHeight / ($element.videoWidth/200);

			navigator.getMedia(
				{
					video: true,
					audio: false
				},
				function(stream) {
					if (navigator.mozGetUserMedia) {
						$element.mozSrcObject = stream;
					} else {
						var vendorURL = window.URL || window.webkitURL;
						$element.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
					}
					$element.play();
				},
				function(err) {
					console.log("An error occured! " + err);
				}
			);

			$element.bind('canPlay', function(){
				if (!streaming) {
					$element.setAttribute('width', '200');
					$element.setAttribute('height', $scope.height);
					streaming = true;
				}
			});
		}
	};
});

app.directive("camerapicture", function(){
	return {
		scope: true,
		restrict: "A",
		link: function($scope, $element){
			var height = $scope.height;
			$element.width = 200;
			$element.height = height;
			if ($scope.takepicture) {
				$element.getContext('2d').drawImage(video, 0, 0, 200, height);
				$scope.data = $element.toDataURL('image/png');
			}
		}
	};
});

app.directive("photo", function(){
	return {
		restrict: "A",
		link: function($scope, $element) {
			$element.setAttribute('src', $scope.data);
		}
	};
});
