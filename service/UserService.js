var AppConfig      = require('../config/AppConfig');
var Logger         = require('log');
var UserRepository = require('../repository/UserRepository');

var log = new Logger(AppConfig.logLevel)

var findOrCreate = function(username, callback){
	UserRepository.findOrCreate(username,function(err,results){
		callback(err,results);
	});
};

module.exports = {
	findOrCreate: findOrCreate
};