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

		data.vout.forEach(function(el, idx, array){

			var address, amount;
			for(var key in el) {
			    if(el.hasOwnProperty(key)) {
			        amount = el[key];
			        address = key;
			        break;
			    }
			}

			var pendingPayment = CacheRepository.getPendingPayment(address);
			if ( pendingPayment ){
				ReceiverService.processReceivedPayment(data, pendingPayment.receiver_id, amount);
			}
		});

		console.log('Transaction -' + JSON.stringify(data));

		// if (data.txlock) {
		// 	console.log("New InstantSend transaction received: " + JSON.stringify(data));
		// } else {
		// 	console.log("New transaction received: " + JSON.stringify(data));
		// }
	});
};


module.exports = {
	start: start
};