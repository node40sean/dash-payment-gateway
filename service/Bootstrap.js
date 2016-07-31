var AppConfig         = require('../config/AppConfig');
var Logger            = require('log');
var Database          = require('../repository/Database');
var CounterRepository = require('../repository/CounterRepository');
var HDWallet          = require('../lib/HDWallet');
var bitcore           = require('bitcore-lib-dash');


var log = new Logger(AppConfig.logLevel)

var initialize = function(callback){

	Database.connect();

	CounterRepository.findOrCreate('hd-wallet-child', function(err, value){
		log.warning('Next child address for the HD Wallet will be at position ' + value);

		if ( AppConfig.wallet.seed.startsWith('xpub') ){
			// Convert seed to BIP32
			var bip32Seed = HDWallet.ImportElectrumPubKey(AppConfig.wallet.seed, AppConfig.wallet.network).xpubkey;
			log.info('Electrum seed [' + AppConfig.wallet.seed + '] converted to BIP32 format [' + bip32Seed + ']');
			AppConfig.wallet.seed = bip32Seed;

			if ( bitcore.HDPublicKey.isValidSerialized(AppConfig.wallet.seed, AppConfig.wallet.network) ){
				log.info('Seed is valid for ' + AppConfig.wallet.network);
			}
			// console.log('Seed address is ' + bitcore.Address(AppConfig.wallet.seed));

		}else{
			log.debug('Wallet seed is BIP32 compatible.');
		}

		callback(null, 'App initialized.')
	});
};

module.exports = {
	initialize: initialize
};