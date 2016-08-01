var AppConfig         = require('../config/AppConfig');
var Logger            = require('log');
var bitcore           = require('bitcore-lib-dash');
var log               = new Logger(AppConfig.logLevel);
var CounterRepository = require('../repository/CounterRepository');
var HDWallet          = require('../lib/HDWallet');

var getNextAddress = function (callback) {

    CounterRepository.getAndIncrement('hd-wallet-child', function(err, child){

        log.debug('Getting new deposit address at position ' + child + ' with seed: ' + AppConfig.wallet.seed);

        // Import the seed as a Bitcore HDPublicKey object
        // (seed is a BIP32 extended skey https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
        var hDPublicKey = HDWallet.ImportXPubKey(AppConfig.wallet.seed, bitcore.Networks.testnet);

        // ..alternatively, generate an hDPublicKey from a random HDPrivateKey (for testing)
        //var hDPublicKey = HDWallet.ImportXPubKey(vec2_m_dash_test, bitcore.Networks.testnet);

        // Generate the next address (using Electrum's m/0/i paths for receiving addresses)
        // (returns Bitcore Address object: https://bitcore.io/api/lib/address)
        var nextAddress = HDWallet.GetAddress(hDPublicKey, child);

        if (bitcore.Address.isValid(nextAddress)) {
            callback(null, nextAddress.toString());
        }else{
            callback('Unable to derive a proper deposit address.')
        }
    });
};

module.exports = {
    getNextAddress: getNextAddress
};