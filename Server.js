var express          = require('express');
var AppConfig        = require('./config/AppConfig');
var Bootstrap        = require('./service/Bootstrap');
var UserService      = require('./service/UserService');
var ReceiverService  = require('./service/ReceiverService');
var bodyParser       = require('body-parser');
var app              = express();
var Logger           = require('log');
var log              = new Logger(AppConfig.logLevel);

app.use(bodyParser.json()); // support json encoded bodies

app.post('/createReceiver', function(req,res){

	var fiatCode    = req.body.currency
	var fiatAmount  = req.body.amount
	var username    = req.body.email
	var description = req.body.description

	var user = UserService.findOrCreate(username, function(err, user){
		if ( err ){
			res.send(err);
		}else{
			ReceiverService.createReceiver(username, fiatCode, fiatAmount, description, function(err, receiver){
				if ( err ){
					res.send(err);
				}else{
					res.send(receiver);
				}
			});
		}
	});



});

Bootstrap.initialize(function(err, results){
	if ( err ){
		log.emergency(err);
	}else{

		log.info(results);

		var server = app.listen(AppConfig.port, function () {

			var host = server.address().address;
			var port = server.address().port;
			log.info('Payment Gateway is now listening at http://%s:%s', host, port);
		});	
	}
});

