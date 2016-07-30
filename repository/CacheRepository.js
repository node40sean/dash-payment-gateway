var dbPool        = require('./Database').connect();
var Logger        = require('log');
var AppConfig     = require('../config/AppConfig');

var log = new Logger(AppConfig.logLevel)

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


module.exports = {
	cacheValuation: cacheValuation,
	getCachedData: getCachedData
};