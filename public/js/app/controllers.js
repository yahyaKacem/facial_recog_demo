'use strict';

/* Controllers */

/*function AddCtrl($scope) {
	$scope.name = "Julia Jacobs";
}*/

function AddCtrl($scope) {
	$scope.recordGIFdisabled = false;
	$scope.stopRecordingGIFdisabled = true;
	$scope.width = 320;
	$scope.height = 240;
	$scope.recorddisabled = '';
	$scope.stopdisabled = 'disabled';

	navigator.getMedia = ( navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia);


	var videoConstraints = {
		audio: false,
		video: {
		mandatory: { },
			optional: []
		}
	};

	var recorder;
	$scope.recordGif = function() {
		recordVideoOrGIF();
	};

	function recordVideoOrGIF() {
		navigator.getMedia(videoConstraints, function(stream) {
			$scope.src = URL.createObjectURL(stream);

			recorder = window.RecordRTC(stream, {
				type: 'gif',
				width: $scope.width,
				height: $scope.height
			});
			recorder.startRecording();
		}, function() {
			alert('Webcam access is denied.');
		});

		$scope.recordGIFdisabled = true;
		$scope.stopRecordingGIFdisabled = false;
		$scope.recorddisabled = 'disabled';
		$scope.stopdisabled = '';
	}

	$scope.stopRecordingGif = function() {
		$scope.recordGIFdisabled = false;

		if (recorder)
			recorder.stopRecording(function(url) {
				$scope.url = url;
			});
			// force saving recorded stream to disk
			recorder.save();
	};

}

function RecognizeCtrl($scope) {
	$scope.name = "Julia Jacobs";
}