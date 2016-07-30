var env      = process.env.NODE_ENV || 'development';

var config = {
  development: {
    app: {
      name: 'dash-payment=gateway'
    },
    port: process.env.PORT || 9001,
    logLevel: 'DEBUG', // EMERGENCY|ALERT|CRITICAL|ERROR|WARNING|NOTICE|INFO|DEBUG
    worldcoin: {
        name:  'WorldCoinIndex',
        orgUrl: 'https://www.worldcoinindex.com',
        url: 'https://www.worldcoinindex.com/apiservice/json',
        apiKey: 'mnuEVZ58xJnbnsSfBDH5jEWvg'
      }
  }
};

module.exports = config[env];
