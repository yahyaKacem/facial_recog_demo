'use strict';

/* Controllers */

function SnapshotCtrl($scope, $location, localImageSaveService, apiRequestFactory, formFactory) {
	var port = _.indexOf($location.host, 'localhost') ? ':' + $location.port() : '';

	$scope.showWebcam = false;
	$scope.loading = false;
	$scope.firstname = formFactory.firstname;
	$scope.lastname = formFactory.lastname;

	/**
	 * Webcam success
	 */
	$scope.onSuccess = function () {
		$scope.showWebcam = true;
	};

	this.makeSnapshot = function (canvas) {
		if ($scope.user.$valid) {
			var name = $scope.user.firstname.$modelValue.toLowerCase() + '_' + $scope.user.lastname.$modelValue.toLowerCase();

			// add first and last name form values to form factory to persist
			formFactory.firstname = $scope.user.firstname.$modelValue;
			formFactory.lastname = $scope.user.lastname.$modelValue;

			// add
			apiRequestFactory.request.name = name;
			apiRequestFactory.request.urls = $location.protocol() + '://' + $location.host() + port + '/camera-images/' + name + '.png';
			$scope.loading = localImageSaveService.loading;
			localImageSaveService.saveToServer(canvas, name)
				.then(
				function () {
					$location.path('add');
				});
		}
	};
}

function AddCtrl($scope, $location, rekognitionService, apiRequestFactory, apiResponseFactory) {
	// params for rekognition's ::FaceAdd: Call face_add for each image you want to add
	apiRequestFactory.request.jobs = 'face_add_[' + apiRequestFactory.request.name + ']';
	$scope.snapshot = apiRequestFactory.request.urls;
	var params = apiRequestFactory.request;
	delete params.name;
	$scope.params = params;

	$scope.addImage = function () {
		rekognitionService.get(params)
			.then(
			function (data) {
				apiResponseFactory.response = data;
				$location.path('add_response');
			});
	}

	/**
	 * Redo Snapshot.
	 */
	$scope.redo = function () {
		$location.path('/');
	}

}

function AddResponseCtrl($scope, $location, rekognitionService, apiResponseFactory) {

	if (apiResponseFactory.response['face_detection'].length > 0) {
		$scope.data = apiResponseFactory.response;
		$scope.alert = {status: 'success', message: 'Snapshot has been recognized as being a face!'};
	} else {
		$scope.alert = {status: 'error', message: "Snapshot has been not been recognized as being a face. Please go back and try again."};
	}

	// params for rekognition's ::FaceTrain:
	var params = {
		jobs: 'face_train',
		urls: apiResponseFactory.response['url']
	};

	$scope.train = function () {
		rekognitionService.get(params)
			.then(
			function (data) {
				apiResponseFactory.response = data;
				$location.path('train');
			});
	}

	/**
	 * Redo Snapshot.
	 */
	$scope.redo = function () {
		$location.path('/');
	};
}

function TrainCtrl($scope, $location, apiResponseFactory) {
	if (apiResponseFactory.response.usage.status == "Succeed.") {
		$scope.data = apiResponseFactory.response;
		$scope.alert = {status: 'success', message: 'Facial recognition training successful!'};
	} else {
		$scope.alert = {status: 'error', message: "Facial recognition training failed. Please go back and try again."};
	}

	$scope.recognize = function () {
		$location.path('new_snapshot');
	}

	/**
	 * Redo Snapshot.
	 */
	$scope.redo = function () {
		$location.path('/');
	};

}

function NewSnapshotCtrl($scope, $location, localImageSaveService, apiRequestFactory) {
	var port = _.indexOf($location.host, 'localhost') ? ':' + $location.port() : '';

	$scope.showWebcam = false;
	$scope.loading = false;

	/**
	 * Webcam success
	 */
	$scope.onSuccess = function () {
		$scope.showWebcam = true;
	};

	this.makeSnapshot = function (canvas) {
		var randNum = Math.floor((Math.random()*100)+1);
		var randImageName = 'recog_image_' + randNum;
		apiRequestFactory.request.urls = $location.protocol() + '://' + $location.host() + port + '/camera-images/' + randImageName + '.png';
			$scope.loading = localImageSaveService.loading;
			localImageSaveService.saveToServer(canvas, randImageName)
				.then(
				function () {
					$location.path('recognize');
				});
		}
}

function RecognizeCtrl($scope, $location, apiRequestFactory, apiResponseFactory, rekognitionService) {
	$scope.snapshot = apiRequestFactory.request.urls;

	// params for rekognition's ::FaceRecognize:
	var params = {
		jobs: 'face_recognize',
		urls: apiRequestFactory.request.urls
	};

	$scope.recognize = function () {
		rekognitionService.get(params)
			.then(
			function (data) {
				apiResponseFactory.response = data;
				$location.path('recognize_response');
			});
	}

	/**
	 * Redo Snapshot.
	 */
	$scope.redo = function () {
		$location.path('/new_snapshot');
	}
}

function RecognizeResponseCtrl($scope, apiResponseFactory) {
	function toTitleCase(str)
	{
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}

	if (apiResponseFactory.response.usage.status == "Succeed.") {
		$scope.data = apiResponseFactory.response;

		var matches = apiResponseFactory.response.face_detection[0]['matches'];

		_.map(matches, function(match){
			match.score = parseFloat(match.score);
			match.tag = toTitleCase(match.tag.replace("_"," "));
		})

		var sorted = _.sortBy(matches, 'score');
		var name = sorted[0]['tag'];

		$scope.alert = {status: 'success', message: 'Facial recognition successful! You are ' + name + '.'};
	} else {
		$scope.alert = {status: 'error', message: "Facial recognition failed."};
	}

}
