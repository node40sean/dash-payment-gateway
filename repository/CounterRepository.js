var dbPool        = require('./Database').connect();
var Logger        = require('log');
var AppConfig     = require('../config/AppConfig');

var log = new Logger(AppConfig.logLevel)

var findCounter = function(counterKey, connection, callback){
	connection.query("select counter_value from counter where counter_key = ?", [counterKey],  function(err,result){ 
            if ( !err ){
            	if ( result.length === 0 ){
            		return callback(err, undefined);
            	}else{
            		return callback(err,result[0].counter_value);
            	}
            }else{
            	return callback(err,result);
            }
        });
};

var createCounter = function(counterKey, connection, callback){
	var DEFAULT_VALUE = 0;
	log.debug('Creating counter ' + counterKey + ' and initializing to ' + DEFAULT_VALUE);
	connection.query("insert into counter set counter_key = ?, counter_value = ?", [counterKey, DEFAULT_VALUE], function(err,results){
		return callback(err,DEFAULT_VALUE);
	});
};

var findOrCreate = function(counterKey, callback){
	dbPool.getConnection(function(err,connection){
		findCounter(counterKey, connection, function(err, counter){
			if ( counter === undefined ){
				createCounter(counterKey, connection, function(err, counterValue){
					connection.release();
					callback(err, counterValue);
				});
			}else{
				connection.release();
				return callback(err, counter);
			}
		});
	});
};

var updateCounter = function(counterKey, counterValue, connection, callback){
	connection.query("update counter set counter_value = ? where counter_key = ?", [counterValue, counterKey], callback);
};

var getAndIncrement = function(counterKey, callback){
	dbPool.getConnection(function(err,connection){
		findCounter(counterKey, connection, function(err, counter){
			var nextChild = counter + 1;
			updateCounter(counterKey, nextChild, connection, function(err, results){
				connection.release();
				return callback(null, nextChild);
			});
		});
	});
};

module.exports = {
	getAndIncrement: getAndIncrement,
	findOrCreate: findOrCreate
};