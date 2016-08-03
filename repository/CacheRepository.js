var dbPool             = require('./Database').connect();
var Logger             = require('log');
var AppConfig          = require('../config/AppConfig');
var LokiCache          = require('lokijs');
var ReceiverRepository = require('./ReceiverRepository');

var log = new Logger(AppConfig.logLevel);
var receivers;

var getData = function(cacheKey, connection, callback){
	connection.query("select cache_data from data_cache where cache_key = ?", [cacheKey], function(err,result){ 
            if ( !err ){
            	if ( result.length === 0 ){
            		return callback(err, null);
            	}else{
            		return callback(err,JSON.parse(JSON.stringify(result[0].cache_data).replace(/\\"/g, '"').replace('"{', '{').replace('}"','}')));
            	}
            }else{
            	return callback(err,result);
            }
        });
};

var getCachedData = function(cacheKey, callback){
	dbPool.getConnection(function(err,connection){
		getData(cacheKey, connection, function(err, results){
			connection.release();
			return callback(err, results);
		});
	});
};

var deleteCacheData = function(cacheKey, connection, callback){
	connection.query("delete from data_cache where cache_key = ?", [cacheKey], callback);
};

var cacheValuation = function(exchange, data, callback){
	log.debug('Caching dash valuation in case future calls fail');
    dbPool.getConnection(function(err,connection){
    	deleteCacheData(exchange, connection, function(err, deleteResults){
    		if ( !err ){
    			log.debug('Adding ' + exchange + ' to cache.');
		    	connection.query("insert into data_cache (cache_key, cache_data) values (?, ?)", [exchange, data], function(err,insertResults){
			    	connection.release();
			    	return callback(err,insertResults);
			    });		
    		}else{
    			connection.release();
			    return callback(err,deleteResults);
    		}
    	});
    	
    });
};

var getPendingPayment = function(address){
    var pendingPayment = receivers.find({'dash_payment_address': address});
    return pendingPayment.length > 0 ? pendingPayment[0] : undefined;
};

var initialize = function(callback){
    if ( global.cache == undefined ){
        global.cache = new LokiCache('cache');
    }

    ReceiverRepository.getUnpaid(function(err, results){

        if ( err ){
            return callback(err, results);
        }else{
            receivers = global.cache.addCollection('receivers', { indices: ['dash_payment_address'] });
            for ( var i = 0 ; i < results.length ; i++ ){
                receivers.insert(results[i]);
                log.debug('Waiting for payment of ' + results[i].amount_duffs + ' duffs to ' + results[i].dash_payment_address);
            }
            return callback(err,'Cache initialized.');
        }
    });

};

module.exports = {
	cacheValuation: cacheValuation,
	getCachedData: getCachedData,
    initialize: initialize,
    getPendingPayment: getPendingPayment
};