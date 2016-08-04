var AppConfig       = require('../config/AppConfig');
var socket          = require('socket.io-client')(AppConfig.insight);
var CacheRepository = require('../repository/CacheRepository');
var Logger          = require('log');
var ReceiverService = require('./ReceiverService');
var Request         = require('request');

var log = new Logger(AppConfig.logLevel)

var start = function(){

	socket.on('connect', function() {
		socket.emit('subscribe', 'inv');
	});

	socket.on('tx', function(data) {

		var address = '', amount = 0, i, key, pendingPayment;

		for ( i = 0 ; i < data.vout.length ; i++ ){

			
			for(key in data.vout[i]) {
			    if(data.vout[i].hasOwnProperty(key)) {
			        amount = data.vout[i][key];
			        address = key;
			        break;
			    }
			}

			pendingPayment = CacheRepository.getPendingPayment(address);
			if ( pendingPayment ){
				log.debug('Payment received at ' + address + ' for ' + amount + ' duffs');
				ReceiverService.processReceivedPayment(data, pendingPayment.receiver_id, amount);
				break;
			}
		}

		//log.debug('Observed Transaction ==> ' + JSON.stringify(data));
	});
};

var checkForPayment = function(receiver){
	
	var url = AppConfig.insight + 'insight-api/addr/' + receiver.dash_payment_address;

	log.debug("Checking block chain for payment to " + receiver.dash_payment_address);

	Request.get(url, function (err, response, body) {
		if ( !err && response.statusCode == 200 ){

			var tx = JSON.parse(body);

			if ( tx !== undefined ){

				var balance = tx.balance + tx.unconfirmedBalance;
				var balanceSat = tx.balanceSat + tx.unconfirmedBalanceSat;

				if ( balanceSat > 0 ){
					log.debug('Balance of ' + receiver.dash_payment_address + ' is ' + balanceSat + '. Payment received to-date is ' + receiver.payment_received_amount_duffs);
				}
			
				if ( balanceSat > 0 && (receiver.payment_received_amount_duffs === undefined || balanceSat > receiver.payment_received_amount_duffs) ){
					receiver.payment_received_amount_duffs = balanceSat;
					receiver.payment_date = new Date();
					ReceiverService.setReceivedPayment(receiver, balanceSat);
				}
			}

		}else{
			log.error('ERROR: fetching data from ' + url + '. Details: ' + err + '. BODY=' + body);
		}
	});
};

module.exports = {
	start: start,
	checkForPayment: checkForPayment
};