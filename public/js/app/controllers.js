'use strict';

/* Controllers */

/*function AddCtrl($scope) {
	$scope.name = "Julia Jacobs";
}*/

function AddCtrl($scope) {
	// completely and totally ripped off from http://jonashartmann.github.io/webcam-directive demo
	var _video = null,
		patData = null,
		imgURL = null;

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
	$scope.makeSnapshot = function makeSnapshot() {
		if (_video) {
			var patCanvas = document.querySelector('#snapshot');
			if (!patCanvas) return;

			patCanvas.width = _video.width;
			patCanvas.height = _video.height;
			var ctxPat = patCanvas.getContext('2d');

			var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
			ctxPat.putImageData(idata, 0, 0);

			patData = idata;
			saveToServer(patCanvas);
			$scope.showSnapShot = true;
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
		console.log('name is ' + $scope.name);
		console.log('data is ' + imgURL);
	}

	var getVideoData = function getVideoData(x, y, w, h) {
		var hiddenCanvas = document.createElement('canvas');
		hiddenCanvas.width = _video.width;
		hiddenCanvas.height = _video.height;
		var ctx = hiddenCanvas.getContext('2d');
		ctx.drawImage(_video, 0, 0, _video.width, _video.height);
		return ctx.getImageData(x, y, w, h);
	};

	var saveToServer = function(canvas) {
		var dataURL = encodeURIComponent(canvas.toDataURL("image/png"));
		var url = "/camera/" + encodeURIComponent($scope.name) + "/";
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

function RecognizeCtrl($scope) {
	$scope.name = "Julia Jacobs";
}