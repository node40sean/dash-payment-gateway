var AppConfig      = require('../config/AppConfig');
var Logger         = require('log');
var UserRepository = require('../repository/CounterRepository');

var log = new Logger(AppConfig.logLevel)

var getNextAddress = function(callback){
	callback(null, 'test-address');
};

module.exports = {
	getNextAddress: getNextAddress
};