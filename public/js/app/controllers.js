'use strict';

/* Controllers */

function SnapshotCtrl($scope, $location, localImageSaveService, apiRequestFactory, formFactory) {
	// completely and totally ripped off from http://jonashartmann.github.io/webcam-directive demo
	var _video = null,
		patData = null,
		port = _.indexOf($location.host, 'localhost') ? ':' + $location.port() : '';

	$scope.showDemos = false;
	$scope.showSnapShot = false;
	$scope.webcamError = false;
	$scope.loading = false;
	$scope.firstname = formFactory.firstname;
	$scope.lastname = formFactory.lastname;

	$scope.patOpts = {x: 0, y: 0, w: 25, h: 25};

	/**
	 * Webcam error
	 * @param err
	 */
	$scope.onError = function (err) {
		$scope.$apply(
			function () {
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
		$scope.$apply(function () {
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
				var name = $scope.user.firstname.$modelValue.toLowerCase() + '_' + $scope.user.lastname.$modelValue.toLowerCase();

				// add first and last name form values to form factory to persist
				formFactory.firstname = $scope.user.firstname.$modelValue;
				formFactory.lastname = $scope.user.lastname.$modelValue;

				// add
				apiRequestFactory.request.name = name;
				apiRequestFactory.request.urls = $location.protocol() + '://' + $location.host() + port + '/camera-images/' + name + '.png';
				$scope.loading = localImageSaveService.loading;
				localImageSaveService.saveToServer(patCanvas, name).then($location.path('add'));
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
}

function AddCtrl($scope, $location, rekognitionService, apiRequestFactory, apiResponseFactory) {
	// params for rekognition's ::FaceAdd: Call face_add for each image you want to add
	apiRequestFactory.request.jobs = 'face_add_[' + apiRequestFactory.request.name + ']';
	$scope.snapshot = apiRequestFactory.request.urls;
	var params = apiRequestFactory.request;
	delete params.name;
	$scope.params = params;

	$scope.addImage = function() {
		rekognitionService.add(params);
	}

	/**
	 * Redo Snapshot.
	 */
	$scope.redo = function () {
		$location.path('/');
	}

}

function RecognizeCtrl($scope, apiResponseFactory) {
	$scope.data = apiResponseFactory.response;
}