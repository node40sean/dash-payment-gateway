var AppConfig             = require('../config/AppConfig');
var Logger                = require('log');
var ReceiverRepository    = require('../repository/ReceiverRepository');
var WalletService         = require('./WalletService');
var DashValuationService  = require('./DashValuationService');
var RandomString          = require("randomstring");

var log = new Logger(AppConfig.logLevel)

var createReceiver = function(username, fiatCode, fiatAmount, description, callback){
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
					description: description
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

module.exports = {
	createReceiver: createReceiver
};