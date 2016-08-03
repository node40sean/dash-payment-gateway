var AppConfig             = require('../config/AppConfig');
var Logger                = require('log');
var ReceiverRepository    = require('../repository/ReceiverRepository');
var WalletService         = require('./WalletService');
var DashValuationService  = require('./DashValuationService');
var RandomString          = require("randomstring");
var Request               = require('request');


var log = new Logger(AppConfig.logLevel)

var createReceiver = function(username, fiatCode, fiatAmount, description, callbackUrl, callback){
	WalletService.getNextAddress(function(err, address){
		if ( err ){
			return callback(err, null);
		}else{
			DashValuationService.getCurrentValue(fiatCode, function(err, value){

				var amountDuffs = (fiatAmount / value) * 100000000
				var receiver = {
					receiver_id: RandomString.generate(32),
					username: username,
					dash_payment_address: address,
					amount_fiat: fiatAmount,
					type_fiat: fiatCode,
					base_fiat: value,
					amount_duffs: amountDuffs.toFixed(0),
					description: description,
					callback_url: callbackUrl
				};

				ReceiverRepository.createNewReceiver(receiver, function(err, results){
					if ( err ){
						callback(err, results);
					}else{
						callback(null, receiver);
					}
				});
			});
		}
	});
};

var processReceivedPayment = function(tx, receiverId, amountDuffs){

	ReceiverRepository.updatePayment(receiverId, amountDuffs, function(err, results){
		if ( err ){
			log.error('Error trying to update a receiver\'s payment. Details: ' + err);
		}else{
			Request({
				url: 'http://localhost:9001/cb',
				method: 'post',
				body: {'foo': 'bar'},
				json: true
			}, function(err, resp){
				log.debug('Response from callback URL: ' + resp);
			});
		}
	});
};

module.exports = {
	createReceiver: createReceiver,
	processReceivedPayment: processReceivedPayment
};