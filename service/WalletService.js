var AppConfig         = require('../config/AppConfig');
var Logger            = require('log');
var bitcore           = require('bitcore-lib-dash');
var log               = new Logger(AppConfig.logLevel);
var CounterRepository = require('../repository/CounterRepository');
var HDWallet          = require('../lib/HDWallet');

var getNextAddress = function (callback) {

    CounterRepository.getAndIncrement('hd-wallet-child', function(err, child){

        log.debug('Getting new deposit address at position ' + child + ' with seed: ' + AppConfig.wallet.seed);

        // Generate the next address (using Electrum's m/0/i paths for receiving addresses)
        // (returns Bitcore Address object: https://bitcore.io/api/lib/address)
        var nextAddress = HDWallet.GetAddress(AppConfig.wallet.seed, child);

        if (bitcore.Address.isValid(nextAddress)) {
            return callback(null, nextAddress.toString());
        }else{
            return callback('Unable to derive a proper deposit address.')
        }
    });
};

module.exports = {
    getNextAddress: getNextAddress
};