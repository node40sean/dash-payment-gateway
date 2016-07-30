var AppConfig       = require('../config/AppConfig');
var Logger          = require('log');
var CacheRepository = require('../repository/CacheRepository');

var log = new Logger(AppConfig.logLevel)

var fetchExchangeData = function(exchange, url, callback){
	request.get(url, function (err, response, body) {
		if ( !err && response.statusCode == 200 ){
			try {
	            callback(null, JSON.parse(body));
	        }catch (e) {
	            return callback('ERROR parsing response from ' + exchange + '. Details: ' + e + '\nResponse::' + body);
	        }
		}else if ( err ){
            return callback('ERROR: fetching data from ' + exchange + ' (' + url + ') Details: ' + err + '. BODY=' + body, null);
        }else{
        	return callback('ERROR: unexpected response code (' + response.statusCode + ') from url=[' + url + '] Details: ' + body);
        }
	});
};

var fetchFromWorlCoinIndex = function(callback){

	var url = AppConfig.worldcoin.url + '?key=' + AppConfig.worldcoin.apiKey
	log.debug('Fetching dash value data from ' + AppConfig.exchanges.worldcoin.name + ' at ' + url);

	fetchExchangeData(AppConfig.worldcoin.name, url, function(err, result){
		if ( err ){
			return callback(err);
		}else{
			var dashResults = result.Markets.find(function (market) {
		        return market.Name === "Dash";
		    });
		    if ( dashResults ){
		    	CacheRepository.cacheValuation('worldcoinindex', dashResults, function(err, result){
		    		return callback(null, dashResult);	
		    	});
		    }else{
		    	return callback('Unable to find the Dash Market data in the response from WorldCoinIndex. Endpoint is [' + url + ']');
		    }
		}
	});
};

var getCurrentValue = function(fiatCode, callback){
	return callback(null, 9.5);
};

module.exports = {
	getCurrentValue: getCurrentValue
};