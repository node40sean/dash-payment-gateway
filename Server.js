var express      = require('express');
var app          = express();
var AppConfig    = require('./config/AppConfig');
var Database     = require('./repository/Database');
var UserService  = require('./service/UserService');
var bodyParser   = require('body-parser');

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
			res.send(user);
		}
	});



});

Database.connect();

var server = app.listen(AppConfig.port, function () {

	var host = server.address().address;
	var port = server.address().port;
	console.log('Payment Gateway is now listening at http://%s:%s', host, port);
});