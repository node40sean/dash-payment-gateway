var AppConfig       = require('../config/AppConfig');
var socket          = require('socket.io-client')(AppConfig.insight);
var CacheRepository = require('../repository/CacheRepository');
var Logger          = require('log');
var ReceiverService = require('./ReceiverService');

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


module.exports = {
	start: start
};