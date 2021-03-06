
/**
 * Module dependencies.
 */

var express = require("express"),
    app     = express(),
    routes = require('./routes'),
		camera = require('./routes/camera'),
    port    = parseInt(process.env.PORT, 10) || 5000;

// Configuration

app.configure(function(){
	app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
	app.use(express.logger('dev'));
  app.use(express.methodOverride());
  app.use(express.bodyParser());
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		next();
	});
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.all('/', function(req, res, next) {
	res.type('html');
	next();
});

// Routes
app.get('/camera/delete', camera.deleteImages);
app.post('/camera/:username', camera.saveImage);
app.get('/*', routes.index);

// Start server
app.listen(port);
console.log('me server, me start on port ' + port + ' in ' + process.env.NODE_ENV + ' environment.');