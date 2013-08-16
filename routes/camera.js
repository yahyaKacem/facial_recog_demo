/*
 * GET home page.
 */
var fs = require("fs");

exports.saveImage = function (req, res, next) {
	var username = req.params.username,
		image = decodeURIComponent(req.body.image),
		binaryData;

	var base64Data = image.replace(/^data:image\/png;base64,/, "");
	base64Data += base64Data.replace('+', ' ');
	binaryData = new Buffer(base64Data, 'base64').toString('binary');

	fs.writeFile("public/camera-images/" + username + ".png", binaryData, "binary", function (err) {
		if (err) {
		console.log(err); // writes out file without error, but it's not a valid image
		} else {
			console.log("public/camera-images/" + username + ".png saved")
		}
	});
};
