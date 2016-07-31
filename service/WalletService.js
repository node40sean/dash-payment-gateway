var AppConfig         = require('../config/AppConfig');
var Logger            = require('log');
var bitcore           = require('bitcore-lib-dash');
var log               = new Logger(AppConfig.logLevel);
var CounterRepository = require('../repository/CounterRepository');
var HDWallet          = require('../lib/HDWallet');

var getNextAddress = function (callback) {

    CounterRepository.getAndIncrement('hd-wallet-child', function(err, child){

        log.debug('Getting new deposit address at position ' + child);
        var nextAddress = HDWallet.GetAddress(AppConfig.walletPublicSeed, child);

        if (bitcore.Address.isValid(nextAddress)) {
            callback(null, nextAddress.toString());
        }else{
            callback('Unable to derive a proper deposit address.')
        }
    });

    // Generate the next address (as a Bitcore Address object: https://bitcore.io/api/lib/address)
    
};

module.exports = {
    getNextAddress: getNextAddress
};