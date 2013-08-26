'use strict';

/* Directives */
var app = angular.module('myApp.directives', []);

app.directive("prettyPrint", function () {
	return {
		restrict: "A",
		link: function ($scope, $element) {
			$element.prettify({highlight: true}, $scope.data);
		}
	};
});

app.directive("webcamCanvas", function () {
	return {
		restrict: "A",
		scope: {
			canvasToVideoDimensions: '&'
		},
		link: function ($scope, $element) {
			var _video = null,
				patData = null,
				patOpts = {x: 0, y: 0, w: 25, h: 25};

			/**
			 * Creates canvas el
			 * @param videoElem
			 */
			$scope.canvasToVideoDimensions = function (videoElem) {
				// The video element contains the captured camera data
				_video = videoElem;
				patOpts.w = _video.width;
				patOpts.h = _video.height;
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
				$element.width = _video.width;
				$element.height = _video.height;
				var ctx = $element.getContext('2d');
				ctx.drawImage(_video, 0, 0, _video.width, _video.height);
				return ctx.getImageData(x, y, w, h);
			};

			$scope.makeSnapShot = function () {
				// The video element contains the captured camera data
				if (_video) {
					var patCanvas = document.querySelector('#snapshot');
					if (!patCanvas) return;

					patCanvas.width = _video.width;
					patCanvas.height = _video.height;
					var ctxPat = patCanvas.getContext('2d');

					var idata = getVideoData(patOpts.x, patOpts.y, patOpts.w, patOpts.h);
					ctxPat.putImageData(idata, 0, 0);

					patData = idata;
				}

			}
		}
	}
});