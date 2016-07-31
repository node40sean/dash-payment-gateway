var AppConfig         = require('../config/AppConfig');
var Logger            = require('log');
var Database          = require('../repository/Database');
var CounterRepository = require('../repository/CounterRepository');

var log = new Logger(AppConfig.logLevel)

var initialize = function(callback){

	Database.connect();

	CounterRepository.findOrCreate('hd-wallet-child', function(err, value){
		log.warning('Next child address for the HD Wallet will be at position ' + value);
		callback(null, 'App initialized.')
	});
};

module.exports = {
	initialize: initialize
};