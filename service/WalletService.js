var AppConfig = require('../config/AppConfig');
var Logger = require('log');
var bitcore = require('bitcore-lib-dash');
var log = new Logger(AppConfig.logLevel);

var UserRepository = require('../repository/CounterRepository');
var HDWallet = require('../lib/HDWallet');

var getNextAddress = function (callback) {

    // Get the HD public key (the private key will be held off-server)
    // ...note this is the serialized key used in the mocha test
    var xpubkey = 'drkvjJe5sJgqomjLo9QN1bF9pVRaNjtpWRpLmJk3wq2vGQsCkT3ErLcwKcQ8gqUrQm61yCSEHdcwxFEPXnCLjzsAynVbcoifSJJeo5bSCQjibsV';

    // TODO: this needs to be a DB row ID or some other unique incremental counter
    var counter = 1;

    // Generate the next address (as a Bitcore Address object: https://bitcore.io/api/lib/address)
    var nextAddress = HDWallet.GetAddress(xpubkey, counter);

    if (bitcore.Address.isValid(nextAddress)) {

        // TODO: return
        callback(null, 'test-address');
    }
};

module.exports = {
    getNextAddress: getNextAddress
};