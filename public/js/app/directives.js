'use strict';

/* Directives */
var app = angular.module('myApp.directives', ['webcam']);

app.directive("prettyPrint", function () {
	return {
		restrict: "A",
		link: function ($scope, $element) {
			$element.prettify({highlight: true}, $scope.data);
		}
	};
});

app.directive("webcamCanvas", function ($timeout) {
	return {
		require:'^webcam',
		template: '<div class="webcamcanvas" ng-transclude>' +
			'<canvas id="snapshot" ng-hide="true"></canvas>' +
			'</div>',
		restrict: 'E',
		replace: true,
		transclude: true,
		link: function ($scope, $element, $attrs, $webcam) {
			var _video = null,
				patData = null,
				patOpts = {x: 0, y: 0, w: 25, h: 25};

			var canvasElem = $element.find('canvas')[0];

			$webcam.onStream = function(opts) {
				$timeout(function(){
					_video = opts.video;

					$scope.$apply(function(){
						patOpts.w = _video.width;
						patOpts.h = _video.height;
					});
				}, 500);
			};

			$scope.makeSnapShot = function() {
				// The video element contains the captured camera data
				if (_video) {
					var patCanvas = canvasElem;
					if (!patCanvas) return;

					patCanvas.width = _video.width;
					patCanvas.height = _video.height;
					var ctxPat = patCanvas.getContext('2d');

					var idata = getVideoData(patOpts.x, patOpts.y, patOpts.w, patOpts.h);
					ctxPat.putImageData(idata, 0, 0);

					patData = idata;
				}

				/* Call custom callback */
				if ($scope.onWebcamStream) {
					$scope.onWebcamStream({canvas: canvasElem});
				}
			}

			/**
			 * Video data used to create canvas element
			 * @param x
			 * @param y
			 * @param w
			 * @param h
			 * @returns {ImageData}
			 */
			var getVideoData = function getVideoData(x, y, w, h) {
				var patCanvas = document.querySelector('#snapshot');
				$('#snapshot').width = _video.width;
				$('#snapshot').height = _video.height;
				var ctx = $('#snapshot').getContext('2d');
				ctx.drawImage(_video, 0, 0, _video.width, _video.height);
				return ctx.getImageData(x, y, w, h);
			};
		}
	}
});