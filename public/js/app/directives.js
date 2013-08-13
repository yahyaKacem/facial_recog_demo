'use strict';

/* Directives */
var app = angular.module('myApp.directives', []);

app.directive("startbutton", function(){
	return {
		restrict: "A",
		controller: function($scope){
			this.takepicture = false;
		},
		link: ($scope, $element, $attributes, controller) {
			$element.bind('click', function(event){
				controller.takepicture = true;
			});
		}
	};
});

app.directive("webrtcvideo", function(){
	return {
		require: 'startbutton',
		restrict: "A",
		controller: function($scope){
			this.height = 0;
			this.width = 200;
			this.takepicture = false;
		},
		link: ($scope, $element, $attributes, startbuttonController, controller) {
			controller.height = $element.videoHeight / ($element.videoWidth/200);

			controller.takepicture = startbuttonController.takepicture;

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

			$element.bind('canplay', function(event){
				var height;
				if (!streaming) {
					height = $element.videoHeight / ($element.videoWidth/200);
					$element.setAttribute('width', 200);
					$element.setAttribute('height', height);
					streaming = true;
				}
			});
		}
	};
});

app.directive("camerapicture", function(){
	return {
		require: 'webrtcvideo',
		restrict: "A",
		controller: function($scope){
			 this.data = null;
		},
		link: function($scope, $element, $attributes, webrtcvideoController, controller){
			var width = webrtcvideoController.width,
				height = webrtcvideoController.height;
			$element.width = width;
			$element.height = height;
			if (webrtcvideoController.takepicture) {
				$element.getContext('2d').drawImage(video, 0, 0, width, height);
				controller.data = $element.toDataURL('image/png');
			}
		}
	};
});

app.directive("photo", function(){
	return {
		require: 'camerapicture',
		restrict: "A",
		link: ($scope, $element, $attributes, camerapictureController) {
			$element.setAttribute('src', camerapictureController.data);
		}
	};
});
