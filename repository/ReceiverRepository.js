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
		connection.query("select receiver_id, username, dash_payment_address, amount_fiat, type_fiat, base_fiat, amount_duffs, payment_received_amount_duffs, created_date, description, callback_url from receiver where payment_received_amount_duffs is null or payment_received_amount_duffs < amount_duffs",
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

var getReceiver = function(receiverId, connection, callback){
	connection.query("select receiver_id, username, dash_payment_address, amount_fiat, type_fiat, base_fiat, amount_duffs, payment_received_amount_duffs, created_date, payment_date, description, callback_url from receiver where receiver_id = ?", [receiverId], function(err, results){
		if ( err ){
			return callback(err, results);
		}else{
			if ( results.length === 0 ){
        		return callback(err, null);
        	}else{
        		return callback(err,results[0]);
        	}
		}
	});
};

var setPayment = function(receiver, amountDuffs, callback){
	dbPool.getConnection(function(err,connection){
		connection.query("update receiver set payment_received_amount_duffs = ?, payment_date = NOW() where receiver_id = ?", [amountDuffs, receiver.receiver_id], function(err, results){
			connection.release();
			return callback(err, results);
		});
	});
};

var updatePayment = function(receiverId, amountDuffs, callback){
	dbPool.getConnection(function(err,connection){
		getReceiver(receiverId, connection, function(err, receiver){
			if ( err ){
				return callback(err, receiver);
			}else{
				if ( receiver.payment_received_amount_duffs === undefined ){
					receiver.payment_received_amount_duffs = amountDuffs;
				}else{
					receiver.payment_received_amount_duffs += amountDuffs;
				}
				receiver.payment_date = new Date()
			}

			connection.query("update receiver set payment_received_amount_duffs = ?, payment_date = NOW() where receiver_id = ?", [receiver.payment_received_amount_duffs, receiverId], function(err, results){
				connection.release();
				if ( err ){
					return callback(err, results);
				}else{
					return callback(err, receiver);
				}
			});
		});
	});
	//return callback(null, {callback_url: 'http://localhost:9001/cb'});
};

module.exports = {
	createNewReceiver: createNewReceiver,
	getUnpaid: getUnpaid,
	updatePayment: updatePayment,
	setPayment: setPayment
};