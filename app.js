
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

// Routes
app.post('/camera/:username', camera.saveImage);
app.get('/*', routes.index);

// Start server
app.listen(port);
console.log('me server, me start on port ' + port + ' in ' + process.env.NODE_ENV + ' environment.');