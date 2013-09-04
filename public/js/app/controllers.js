'use strict';

/* Controllers */

function SnapshotCtrl($scope, $location, localImageSaveService, apiRequestFactory, formFactory) {
	var port = _.indexOf($location.host, 'localhost') ? ':' + $location.port() : '';

	$scope.showDemos = false;
	$scope.showSnapShot = false;
	$scope.webcamError = false;
	$scope.loading = false;
	$scope.firstname = formFactory.firstname;
	$scope.lastname = formFactory.lastname;

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
	 */
	$scope.onSuccess = function () {
		$scope.showWebCamContainer = true;
		$scope.showDemos = true;
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
					function(){
						$location.path('add');
					});
				$scope.showSnapShot = true;
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

	$scope.addImage = function() {
		rekognitionService.add(params)
			.then(
			function(data){
				apiResponseFactory.response = data;
				$location.path('recognize');
			});
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