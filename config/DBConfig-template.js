var env      = process.env.NODE_ENV || 'development';

var config = {
  development: {
    host: 'localhost',
    port: 3306,
    database: 'dashpay',
    username: 'username',
    password: 'password',
    debug: false
  }
};

module.exports = config[env];
