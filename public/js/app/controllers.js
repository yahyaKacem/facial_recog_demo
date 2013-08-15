'use strict';

/* Controllers */

/*function AddCtrl($scope) {
	$scope.name = "Julia Jacobs";
}*/

function AddCtrl($scope, $location, rekognitionFactory, apiresponseFactory) {
	// completely and totally ripped off from http://jonashartmann.github.io/webcam-directive demo
	var _video = null,
		patData = null,
		data = {};

	$scope.showDemos = false;
	$scope.showSnapShot = false;
	$scope.patOpts = {x: 0, y: 0, w: 25, h: 25};

	$scope.webcamError = false;
	$scope.onError = function (err) {
		$scope.$apply(
			function() {
				$scope.webcamError = err;
			}
		);
	};

	$scope.onSuccess = function (videoElem) {
		$scope.showWebCamContainer = true;
		// The video element contains the captured camera data
		_video = videoElem;
		$scope.$apply(function() {
			$scope.patOpts.w = _video.width;
			$scope.patOpts.h = _video.height;
			$scope.showDemos = true;
		});
	};

	$scope.onStream = function (stream, videoElem) {
		// You could do something manually with the stream.
	};

	/**
	 * Make a snapshot of the camera data and show it in another canvas.
	 */
	$scope.makeSnapshot = function makeSnapshot(user) {
		if (_video) {
			var patCanvas = document.querySelector('#snapshot');
			if (!patCanvas) return;

			patCanvas.width = _video.width;
			patCanvas.height = _video.height;
			var ctxPat = patCanvas.getContext('2d');

			var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
			ctxPat.putImageData(idata, 0, 0);

			patData = idata;
			if (user.$valid) {
				saveToServer(patCanvas, $scope.user.name);
				$scope.showSnapShot = true;
			}
		}
	};

	/**
	 * Redo Snapshot.
	 */
	$scope.redo = function(){
		$scope.showSnapShot = false;
	}

	/**
	 * Send image to db via ReKognition API.
	 */
	$scope.sendImg = function(){
		console.log(data);
		rekognitionFactory.one('api').get(data).then(function (res) {
			apiresponseFactory.api.response = res;
			console.log(res);
		}, function (response) {
			apiresponseFactory.api.response = data;
			console.log("Error with status code", response.status);
		});

		$location.path('recognize');
	}

	var getVideoData = function getVideoData(x, y, w, h) {
		var hiddenCanvas = document.createElement('canvas');
		hiddenCanvas.width = _video.width;
		hiddenCanvas.height = _video.height;
		var ctx = hiddenCanvas.getContext('2d');
		ctx.drawImage(_video, 0, 0, _video.width, _video.height);
		return ctx.getImageData(x, y, w, h);
	};

	var saveToServer = function(canvas, name) {
		data.jobs = 'face_part_aggressive_gender_emotion_age_glass';
		data.user_id = encodeURIComponent(name);
		data.urls = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/camera-images/' + data.user_id + '.png';
		var dataURL = encodeURIComponent(canvas.toDataURL("image/png"));
		var url = "/camera/" + data.user_id + "/";
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = response;

		function response(){
			if(xhr.readyState==4){
				//check your response;
			}
		}

		xhr.open("POST", url,true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send("image="+ dataURL);
	}
}

function RecognizeCtrl($scope, apiresponseFactory) {
	$scope.data = apiresponseFactory.api.response;
}