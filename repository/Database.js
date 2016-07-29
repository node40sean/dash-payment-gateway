var DBConfig     = require('../config/DBConfig');
var mysql        = require('mysql');

var connect = function(){
	if ( global.dbPool == undefined ){
		global.dbPool = mysql.createPool({
		    connectionLimit : DBConfig.connections,
		    host            : DBConfig.host,
		    port            : DBConfig.port,
		    user            : DBConfig.username,
		    password        : DBConfig.password,
		    database        : DBConfig.database,
		    debug           : DBConfig.debug
		});
	}
	return global.dbPool;
};

module.exports = {
	connect: connect
};