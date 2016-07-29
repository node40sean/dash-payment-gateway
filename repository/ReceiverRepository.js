var dbPool        = require('./Database').connect();
var Logger        = require('log');
var AppConfig     = require('../config/AppConfig');

var log = new Logger(AppConfig.logLevel)


var createNewReceiver = function(receiver, callback){
	log.debug('Creating receiver ' + JSON.stringify(receiver, true));
    dbPool.getConnection(function(err,connection){
    	connection.query("insert into receiver (receiver_id, username, dash_payment_address, amount_fiat, type_fiat, base_fiat, amount_duffs, created_date, description) values (?,?,?,?,?,?,?,NOW(),?)", 
            [receiver.receiver_id, receiver.username, receiver.dash_payment_address, receiver.amount_fiat, receiver.type_fiat, receiver.base_fiat, receiver.amount_duffs, receiver.description], function(err,results){
        		connection.release();
                return callback(err,results);
        	});
    });
};

module.exports = {
	createNewReceiver: createNewReceiver
};