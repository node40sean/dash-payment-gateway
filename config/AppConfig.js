var env = process.env.NODE_ENV || 'development';
var bitcore = require('bitcore-lib-dash');

var config = {
    development: {
        app: {
            name: 'dash-payment=gateway'
        },
        insight: 'http://jaxx-test.dash.org:3001/',
        wallet: {
            //seed: 'drkvjJe5sJgqomjLo9QN1bF9pVRaNjtpWRpLmJk3wq2vGQsCkT3ErLcwKcQ8gqUrQm61yCSEHdcwxFEPXnCLjzsAynVbcoifSJJeo5bSCQjibsV', //MAINNET
            seed: 'xpub661MyMwAqRbcEorCw5Bqik47NhE4RCgCgxqvM3DqfpUvVo7dEk7HL5BmqLJCT4EvBUK2pTewJjpd4Z64nXDTaqQuAhuYH4PFdTenCkHzuQa', // ELECTRUM
            //seed: 'DRKVrRjogj3bNiLD8T9WY82udmS2Rnd8PBg9kK4xgmFzpeoPzjBLbynQSZt94tT8RW1zEBFyWjD5GVSaqASKEvSQWuPPtZA4r7ZhE6MEMU5J9xgc', // ELECTRUM (Converted to BIP32)
            network: bitcore.Networks.testnet,
        },
        port: process.env.PORT || 9001,
        logLevel: 'DEBUG', // EMERGENCY|ALERT|CRITICAL|ERROR|WARNING|NOTICE|INFO|DEBUG
        worldcoin: {
            name: 'WorldCoinIndex',
            orgUrl: 'https://www.worldcoinindex.com',
            url: 'https://www.worldcoinindex.com/apiservice/json',
            apiKey: 'mnuEVZ58xJnbnsSfBDH5jEWvg'
        }
    }
};

module.exports = config[env];
