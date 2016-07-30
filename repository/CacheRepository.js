var dbPool        = require('./Database').connect();
var Logger        = require('log');
var AppConfig     = require('../config/AppConfig');

var log = new Logger(AppConfig.logLevel)

var cacheValuation = function(exchange, data, callback){
	log.debug('Caching dash valuation in case future calls fail');
    dbPool.getConnection(function(err,connection){
    	connection.query("insert into data_cache set key = ?, data = ?", [exchange, data], function(err,results){
    		callback(err,results);
    	});
    });
};


module.exports = {
	cacheValuation: cacheValuation
};