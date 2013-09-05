var fs = require("fs");

exports.saveImage = function (req, res) {
	var username = req.params.username,
		image = decodeURIComponent(req.body.image),
		binaryData;

	var base64Data = image.replace(/^data:image\/png;base64,/, "");
	base64Data += base64Data.replace('+', ' ');
	binaryData = new Buffer(base64Data, 'base64').toString('binary');

	fs.writeFile("public/camera-images/" + username + ".png", binaryData, "binary", function (err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			console.log("public/camera-images/" + username + ".png saved");
			res.send(200);
		}
	});
};

exports.deleteImages = function (req, res) {
	fs.readdir("public/camera-images/", function (err, files) {
		"use strict";
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			files.forEach(function (element) {
				var image = "public/camera-images/" + element;
				fs.unlink(image, function (err) {
					if (err) throw err;
					console.log('successfully deleted ' + image);
				});
			})
			console.log("all camera images deleted");
			res.send(200);
		}
	});
};
