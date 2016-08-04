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

	var fiatCode    = req.body.currency;
	var fiatAmount  = req.body.amount;
	var username    = req.body.email;
	var description = req.body.description;
	var callbackUrl = req.body.callbackUrl;

	var user = UserService.findOrCreate(username, function(err, user){
		if ( err ){
			res.send(err);
		}else{
			ReceiverService.createReceiver(username, fiatCode, fiatAmount, description, callbackUrl, function(err, receiver){
				if ( err ){
					res.send(err);
				}else{
					ReceiverService.listenForPayment(receiver);
					res.send({
						receiver_id: receiver.receiver_id,
						username: receiver.username,
						dash_payment_address: receiver.dash_payment_address,
						amount_fiat: receiver.amount_fiat,
						type_fiat: receiver.type_fiat,
						base_fiat: receiver.base_fiat,
						amount_duffs: receiver.amount_duffs,
						created_date: receiver.created_date,
						description: receiver.description
					});
				}
			});
		}
	});
});

/**
*   Example callback URL - Not for use in a production environment. This endpoint is used only for testing, to output the 
*   the results of a callback URL without having to run a completely separate server during development.
*/
app.post('/cb', function(req,res){

	console.log('**********************************************************************************************');
	console.log('Received a call from the payment gateway - a payment must have been made.');
	console.log('**********************************************************************************************');
	console.log(JSON.stringify(req.body, null, 3));
	console.log('**********************************************************************************************');

	res.send('OK')

});

Bootstrap.initialize(function(err, results){
	if ( err ){
		log.emergency(err);
		process.exit(1);
	}else{

		log.info(results);

		var server = app.listen(AppConfig.port, function () {

			var host = server.address().address;
			var port = server.address().port;
			log.info('Payment Gateway is now listening at http://%s:%s', host, port);
		});	
	}
});

