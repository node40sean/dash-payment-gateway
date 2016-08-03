var dbPool        = require('./Database').connect();
var Logger        = require('log');
var AppConfig     = require('../config/AppConfig');

var log = new Logger(AppConfig.logLevel)


var createNewReceiver = function(receiver, callback){
	log.debug('Creating receiver ' + JSON.stringify(receiver, true));
    dbPool.getConnection(function(err,connection){
    	connection.query("insert into receiver (receiver_id, username, dash_payment_address, amount_fiat, type_fiat, base_fiat, amount_duffs, created_date, description, callback_url) values (?,?,?,?,?,?,?,NOW(),?, ?)", 
            [receiver.receiver_id, receiver.username, receiver.dash_payment_address, receiver.amount_fiat, receiver.type_fiat, receiver.base_fiat, receiver.amount_duffs, receiver.description, receiver.callback_url], function(err,results){
        		connection.release();
                return callback(err,results);
        	});
    });
};

var getUnpaid = function(callback){
	dbPool.getConnection(function(err,connection){
		connection.query("select receiver_id, username, dash_payment_address, amount_fiat, type_fiat, base_fiat, amount_duffs, created_date, description, callback_url from receiver where payment_received_amount_duffs is null or payment_received_amount_duffs <= amount_duffs",
			function(err, rows, fields){
				if ( err ){
					connection.release();
					return callback(err);
				}else{
					connection.release();
					log.debug('Number of unpaid transactions: ' + rows.length);

					return callback(null,rows);
				}
			});
	});
};

var updatePayment = function(receiverId, amountDuffs, callback){
	return callback(null, {callback_url: 'http://localhost:9001/cb'});
};

module.exports = {
	createNewReceiver: createNewReceiver,
	getUnpaid: getUnpaid,
	updatePayment: updatePayment
};