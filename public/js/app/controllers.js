'use strict';

/* Controllers */
function AboutCtrl($scope) {};

function SnapshotCtrl($scope, $location, localImageService, apiRequestFactory, formFactory) {
	var port = _.indexOf($location.host, 'localhost') ? ':' + $location.port() : '';
	$scope.showWebcam = false;

	// hard coding name if running on localhost for testing
	$scope.firstname = $location.host() == 'localhost'
		? 'Localhost'
		: formFactory.firstname;
	$scope.lastname = $location.host() == 'localhost'
		? 'Test'
		: formFactory.lastname;

	$scope.onSuccess = function () {
		$scope.showWebcam = true;
	};

	this.makeSnapshot = function (canvas) {
		if ($scope.user.$valid) {
			var name = $scope.user.firstname.$modelValue.toLowerCase() +
				'_' +
				$scope.user.lastname.$modelValue.toLowerCase();
			formFactory.firstname = $scope.user.firstname.$modelValue;
			formFactory.lastname = $scope.user.lastname.$modelValue;
			apiRequestFactory.request.name = name;
			apiRequestFactory.request.urls = $location.protocol() +
				'://' +
				$location.host() +
				port +
				'/camera-images/' +
				name +
				'.png';
			localImageService.save(canvas, name)
				.then(
				function () {
					$location.path('add');
				});
		}
	};
}

function AddCtrl($scope, $location, rekognitionService, apiRequestFactory, apiResponseFactory) {
	$scope.header = "Review snapshot";
	var request = apiRequestFactory.request;
	// params for rekognition's ::FaceAdd: Call face_add for each image you want to add
	request.jobs = 'face_add_[' + request.name + ']';
	$scope.snapshot = request.urls;
	delete request.name;

	$scope.continue = function () {
		rekognitionService.get(request)
			.then(
			function (data) {
				apiResponseFactory.response = data;
				$location.path('add_response');
			});
	}

	$scope.redo = function () {
		$location.path('/');
	}
}

function AddResponseCtrl($scope, $location, rekognitionService, apiResponseFactory) {
	$scope.service = "Add";
	$scope.icon = {
		continue: 'arrow-right',
		return: 'arrow-left'
	};
	$scope.button = {
		continue: 'Continue',
		return: 'Return'
	}
	var response = apiResponseFactory.response;
	if (_.has(response, 'usage') && response['face_detection'].length > 0) {
		$scope.data = response;
		$scope.alert = {status: 'success', message: 'Snapshot has been recognized as being a face!'};
	} else {
		$scope.alert = {status: 'error', message: "Snapshot has been not been recognized as being a face. Please go back and try again."};
	}

	// params for rekognition's ::FaceTrain:
	var params = {
		jobs: 'face_train',
		urls: response['url']
	};

	$scope.continue = function () {
		rekognitionService.get(params)
			.then(
			function (data) {
				response = data;
				$location.path('train');
			});
	};

	$scope.redo = function () {
		$location.path('/');
	};
}

function TrainCtrl($scope, $location, apiResponseFactory) {
	$scope.service = "Train";
	$scope.icon = {
		continue: 'arrow-right',
		return: 'arrow-left'
	};
	$scope.button = {
		continue: 'Continue',
		return: 'Return'
	};
	var response = apiResponseFactory.response;
	if (_.has(response, 'usage') && _.has(response.usage, 'status') && response.usage.status == 'Succeed.') {
		$scope.data = apiResponseFactory.response;
		$scope.alert = {status: 'success', message: 'Facial recognition training successful!'};
	} else {
		$scope.alert = {status: 'error', message: "Facial recognition training failed. Please go back and try again."};
	}
	;

	$scope.continue = function () {
		$location.path('new_snapshot');
	};

	$scope.redo = function () {
		$location.path('/');
	};

}

function NewSnapshotCtrl($scope, $location, localImageService, apiRequestFactory) {
	var port = _.indexOf($location.host, 'localhost') ? ':' + $location.port() : '';

	$scope.showWebcam = false;
	$scope.onSuccess = function () {
		$scope.showWebcam = true;
	};

	this.makeSnapshot = function (canvas) {
		var randNum = Math.floor((Math.random() * 100) + 1);
		var randImageName = 'recog_image_' + randNum;
		apiRequestFactory.request.urls = $location.protocol() + '://' + $location.host() + port + '/camera-images/' + randImageName + '.png';
		localImageService.save(canvas, randImageName)
			.then(
			function () {
				$location.path('recognize');
			});
	}
}

function RecognizeCtrl($scope, $location, apiRequestFactory, apiResponseFactory, rekognitionService) {
	$scope.header = "Review new snapshot";
	$scope.snapshot = apiRequestFactory.request.urls;

	// params for rekognition's ::FaceRecognize:
	var params = {
		jobs: 'face_recognize',
		urls: $scope.snapshot
	};

	$scope.continue = function () {
		rekognitionService.get(params)
			.then(
			function (data) {
				apiResponseFactory.response = data;
				$location.path('recognize_response');
			});
	};

	$scope.redo = function () {
		$location.path('/new_snapshot');
	};
}

function RecognizeResponseCtrl($scope, $location, $filter, apiResponseFactory, localImageService) {
	$scope.service = "Recognize";
	$scope.icon = {
		continue: 'picture',
		return: 'user'
	};
	$scope.button = {
		continue: 'Test with another image',
		return: 'Create new user'
	};
	var response = apiResponseFactory.response;
	if (_.has(response, 'face_detection') && response['face_detection'].length > 0) {
		$scope.data = response;
		var matches = $scope.data.face_detection[0]['matches'];
		_.map(matches, function (match) {
			match.score = parseFloat(match.score);
			match.tag = $filter('toTitleCase')(match.tag.replace("_", " "));
		});
		$scope.name = matches[0]['tag'];
		$scope.alert = {status: 'success', message: 'Facial recognition successful! You are ' + $scope.name + '.'};
	} else {
		$scope.alert = {status: 'error', message: "Facial recognition failed."};
	}

	$scope.redo = function () {
		localImageService.delete();
		$location.path('/');
	}

	$scope.continue = function () {
		localImageService.delete();
		$location.path('/new_snapshot');
	}

}
