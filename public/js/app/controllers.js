'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AddCtrl', [function ($scope) {

    $scope.add-customer.blah = 'blah';
		/* Capture image from device camera and store to ../../camera-images */
		$scope.add-customer.add = function () {

			var videoConstraints = {
				audio: false,
				video: {
					mandatory: { },
					optional: []
				}
			}, recorder;

			navigator.getUserMedia(videoConstraints, function (stream) {
				$scope.add-customer.video.src = URL.createObjectURL(stream);

				recorder = window.RecordRTC(stream, {
					type: 'gif',
					width: 320,
					height: 240
				});
				recorder.startRecording();

				recorder.stopRecording(function (url) {
					$scope.camera_image_url = url;
				});

				recorder.save();

			}, function () {
				alert('Webcam access is denied.');
			});

		};
	}])

  .controller('RecognizeCtrl', [function($scope) {

  }])