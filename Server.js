var express      = require('express');
var app          = express();
var AppConfig    = require('./config/AppConfig');

var server = app.listen(AppConfig.port, function () {

	var host = server.address().address;
	var port = server.address().port;
	console.log('Payment Gateway is now listening at http://%s:%s', host, port);
});