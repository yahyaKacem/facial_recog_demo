/**
 * Created by jjacobs on 8/13/13.
 */

var CAMERA = window.CAMERA || {};

CAMERA.init = function(){
	window.URL = window.URL || window.webkitURL;

	navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia || navigator.msGetUserMedia;
};

CAMERA.hasGetUserMedia = function(){
	// Note: Opera is unprefixed.
	return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
