var dbPool        = require('./Database').connect();
var Logger        = require('log');
var AppConfig     = require('../config/AppConfig');

var log = new Logger(AppConfig.logLevel)

var getAndIncrement = function(counter, callback){
	return callback(null, 1);
};

module.exports = {
	getAndIncrement: getAndIncrement
};