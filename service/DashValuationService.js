var AppConfig       = require('../config/AppConfig');
var Logger          = require('log');
var CacheRepository = require('../repository/CacheRepository');
var Request         = require('request');

var log = new Logger(AppConfig.logLevel)

var fetchExchangeData = function(exchange, url, callback){
	Request.get(url, function (err, response, body) {
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
	log.debug('Fetching dash value data from ' + AppConfig.worldcoin.name + ' at ' + url);

	fetchExchangeData(AppConfig.worldcoin.name, url, function(err, result){
		if ( err ){
			return callback(err);
		}else{
			var dashResults = result.Markets.find(function (market) {
		        return market.Name === "Dash";
		    });
		    if ( dashResults ){

		    	CacheRepository.cacheValuation('worldcoinindex', JSON.stringify(dashResults), function(err, result){
		    		return callback(null, dashResults);	
		    	});
		    }else{
		    	return callback('Unable to find the Dash Market data in the response from WorldCoinIndex. Endpoint is [' + url + ']');
		    }
		}
	});
};

var findFiat_worldCoinIndex = function(fiatCode, data, callback){
	var key = 'Price_' + fiatCode.toLowerCase();

	log.debug('Looking in WorldCoinIndex result for ' + key);

	var price = data[key];
	// var price = data.Price_usd;
	if ( !price ){
		log.warning(key + ' not found.');
		return callback('Fiat not supported [' + fiatCode + ']. Not found in WorldCoinIndex');
	}else{
		log.debug('Found! ' + price);
		return callback(null, price);
	}
};

var getCurrentValue = function(fiatCode, callback){
	fetchFromWorlCoinIndex(function(err, results){
		if ( err ){
			log.warning('Error fetch Dash valuation from WorldCoinIndex. Falling back to cache.');
			CacheRepository.getCachedData('worldcoinindex', function(err, results){
				if ( err ){
					return callback(err, results);
				}else{
					console.log('Cached value=' + JSON.stringify(results));
					findFiat_worldCoinIndex(fiatCode, results, callback)
				}
			});
		}else{

			// Results look like the following
			// {
			// 		Label: "DASH/BTC",
			// 		Name: "Dash",
			// 		Price_btc: 0.01404056,
			// 		Price_usd: 9.21109095,
			// 		Price_cny: 61.34202989,
			// 		Price_eur: 8.26912559,
			// 		Price_gbp: 7.03051322,
			// 		Price_rur: 586.60701859,
			// 		Volume_24h: 469.15014299,
			// 		Timestamp: 1469879640
			// }

			findFiat_worldCoinIndex(fiatCode, results, callback)
		}
	});
};

module.exports = {
	getCurrentValue: getCurrentValue
};