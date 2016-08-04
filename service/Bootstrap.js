var AppConfig          = require('../config/AppConfig');
var Logger             = require('log');
var Database           = require('../repository/Database');
var CounterRepository  = require('../repository/CounterRepository');
var CacheRepository    = require('../repository/CacheRepository');
var HDWallet           = require('../lib/HDWallet');
var bitcore            = require('bitcore-lib-dash');
var BlockChainObserver = require('./BlockChainObserver');


var log = new Logger(AppConfig.logLevel)

var initialize = function(callback){

	Database.connect();

	CounterRepository.findOrCreate('hd-wallet-child', function(err, value){
		log.warning('Next child address for the HD Wallet will be at position ' + value);

		if ( AppConfig.wallet.seed.startsWith('xpub') || AppConfig.wallet.seed.startsWith('tpub') ){
			
			// Import the seed as a Bitcore HDPublicKey object
        	// (seed is a BIP32 extended skey https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
			var bip32Seed = HDWallet.ImportXPubKey(AppConfig.wallet.seed, AppConfig.wallet.network);

			log.info('Electrum master key converted to BIP32 format [' + bip32Seed + ']');
			AppConfig.wallet.seed = bip32Seed;

		}

		// Eventually we want to test if the key is valid but for now, this will always fail to it's commented out until
		// electrun is updated to produce BIP32 keys
		//
		//    if ( bitcore.HDPublicKey.isValidSerialized(AppConfig.wallet.seed, AppConfig.wallet.network) ){
		//    	log.info('Master Key is valid for ' + AppConfig.wallet.network);
		//    }else{
		//    	return callback('Master Key is not valid. Please provide a valid Electrun or BIP32 compatible seed in AppConfig.js');
		//    }

		CacheRepository.initialize(function(err, results){

			var pendingPayments

			if ( err ){
				return callback(err, results);
			}else{
				
				log.info(results);
				BlockChainObserver.start();

				pendingPayments = CacheRepository.getPendingPayments();
				if ( pendingPayments.length > 0 ){
					for ( var i = 0 ; i < pendingPayments.length ; i++ ){
						BlockChainObserver.checkForPayment(pendingPayments[i]);
					}
				}else{
					log.debug('No pending payments to wait for.');
				}

				return callback(null, 'App initialized.')
			}
		});
		
		
	});
};

module.exports = {
	initialize: initialize
};