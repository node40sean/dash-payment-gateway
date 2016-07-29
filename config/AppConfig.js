var env      = process.env.NODE_ENV || 'development';

var config = {
  development: {
    app: {
      name: 'dash-payment=gateway'
    },
    port: process.env.PORT || 9001,
    logLevel: 'DEBUG' // EMERGENCY|ALERT|CRITICAL|ERROR|WARNING|NOTICE|INFO|DEBUG
  }
};

module.exports = config[env];
