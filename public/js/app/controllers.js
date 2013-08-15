'use strict';

/* Controllers */

function SnapshotCtrl($scope, $location, apirequestFactory) {
	// completely and totally ripped off from http://jonashartmann.github.io/webcam-directive demo
	var _video = null,
		patData = null,
		port = _.indexOf($location.host, 'localhost') ? ':' + $location.port() : '';

	$scope.showDemos = false;
	$scope.showSnapShot = false;
	$scope.webcamError = false;

	$scope.patOpts = {x: 0, y: 0, w: 25, h: 25};

	/**
	 * Webcam error
	 * @param err
	 */
	$scope.onError = function (err) {
		$scope.$apply(
			function() {
				$scope.webcamError = err;
			}
		);
	};

	/**
	 * Webcam success
	 * @param videoElem
	 */
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

	/**
	 * Do something manually with stream
	 * @param stream
	 * @param videoElem
	 */
	$scope.onStream = function (stream, videoElem) {
		// You could do something manually with the stream.
	};

	/**
	 * Make a snapshot of the camera data and show it in another canvas.
	 * @param user
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
				var name = $scope.user.firstname.toLowerCase() + '_' + $scope.user.lastname.toLowerCase();
				apirequestFactory.request.name = name;
				saveToServer(patCanvas, name);
				$scope.showSnapShot = true;
			}
		}
	};

	/**
	 * Video data used to create canvas element
	 * @param x
	 * @param y
	 * @param w
	 * @param h
	 * @returns {ImageData}
	 */
	var getVideoData = function getVideoData(x, y, w, h) {
		var hiddenCanvas = document.createElement('canvas');
		hiddenCanvas.width = _video.width;
		hiddenCanvas.height = _video.height;
		var ctx = hiddenCanvas.getContext('2d');
		ctx.drawImage(_video, 0, 0, _video.width, _video.height);
		return ctx.getImageData(x, y, w, h);
	};

	/**
	 *
	 * @param canvas
	 * @param name
	 */
	var saveToServer = function(canvas, name) {
		apirequestFactory.request.urls = $location.protocol() + '://' + $location.host() + port + '/camera-images/' + name + '.png';

		// Post image to server via xhr
		var dataURL = encodeURIComponent(canvas.toDataURL("image/png"));
		var url = "/camera/" + name + "/";
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

function AddCtrl($scope, $location, rekognitionFactory, apirequestFactory, apiresponseFactory) {
	// param for rekognition's ::FaceAdd: Call face_add for each image you want to add
	apirequestFactory.request.jobs = 'face_add_[' + apirequestFactory.request.name + ']';

	/**
	 * Send image to db via ReKognition API.
	 */
	$scope.sendImg = function(){
		console.log(apirequestFactory.request);
		rekognitionFactory.one('api').get(apirequestFactory.request).then(function (res) {
			apiresponseFactory.response = res;
		}, function (response) {
			console.log("Error with status code", response.status);
		});

		$location.path('recognize');
	}

	/**
	 * Redo Snapshot.
	 */
	$scope.redo = function(){
		$location.path('snapshot');
	}

}

function RecognizeCtrl($scope, apiresponseFactory) {
	$scope.data = apiresponseFactory.api.response;
}