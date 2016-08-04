var env = process.env.NODE_ENV || 'development';
var bitcore = require('bitcore-lib-dash');

var config = {
    development: {
        app: {
            name: 'dash-payment=gateway'
        },
        insight: 'http://jaxx-test.dash.org:3001/',
        wallet: {
            seed: 'xpub661MyMwAqRbcEorCw5Bqik47NhE4RCgCgxqvM3DqfpUvVo7dEk7HL5BmqLJCT4EvBUK2pTewJjpd4Z64nXDTaqQuAhuYH4PFdTenCkHzuQa', // ELECTRUM
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
