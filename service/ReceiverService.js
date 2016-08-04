var AppConfig             = require('../config/AppConfig');
var Logger                = require('log');
var ReceiverRepository    = require('../repository/ReceiverRepository');
var WalletService         = require('./WalletService');
var DashValuationService  = require('./DashValuationService');
var RandomString          = require("randomstring");
var Request               = require('request');
var CacheRepository       = require('../repository/CacheRepository');


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

var invokePaymentCallback = function(receiver){
	Request({
		url: receiver.callback_url,
		method: 'post',
		body: {
			receiver_id: receiver.receiver_id,
			username: receiver.username,
			dash_payment_address: receiver.dash_payment_address,
			amount_fiat: receiver.amount_fiat,
			type_fiat: receiver.type_fiat,
			base_fiat: receiver.base_fiat,
			amount_duffs: receiver.amount_duffs,
			created_date: receiver.created_date,
			description: receiver.description,
			payment_received_amount_duffs: receiver.payment_received_amount_duffs,
			payment_date: receiver.payment_date
		},
		json: true
	}, function(err, resp){
		log.debug('Response from callback URL: ' + resp);
	});
};

var listenForPayment = function(receiver){
	CacheRepository.addReceiver(receiver);
};

var setReceivedPayment = function(receiver, amountDuffs){
	ReceiverRepository.setPayment(receiver, amountDuffs, function(err, results){
		if ( err ){
			log.error('Error setting payment from blockchain. Details: ' + err );
		}else{
			invokePaymentCallback(receiver);
			updateCache(receiver);
		}
	});
};

var updateCache = function(receiver){
	// If the payment is greater than or equal to the expected amount, remove from cache.
	if ( receiver.payment_received_amount_duffs >= receiver.amount_duffs ){
		log.debug('Full payment has been satisfied. Removing from cache now.');
		CacheRepository.removeReceiver(receiver.dash_payment_address);
	}else{
		CacheRepository.updateReceiver(receiver);
		log.debug('Insufficient payment. Expected ' + receiver.amount_duffs + ' but received (to-date) ' + receiver.payment_received_amount_duffs);
	}
};

var processReceivedPayment = function(tx, receiverId, amountDuffs){

	ReceiverRepository.updatePayment(receiverId, amountDuffs, function(err, receiver){
		if ( err ){
			log.error('Error trying to update a receiver\'s payment. Details: ' + err);
		}else{

			invokePaymentCallback(receiver);
			updateCache(receiver);
		}
	});
};

module.exports = {
	createReceiver: createReceiver,
	processReceivedPayment: processReceivedPayment,
	setReceivedPayment: setReceivedPayment,
	listenForPayment: listenForPayment
};