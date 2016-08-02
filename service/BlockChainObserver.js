var socket = require('socket.io-client')('http://jaxx-test.dash.org:3001/');

var start = function(){

	socket.on('connect', function() {
		socket.emit('subscribe', 'inv');
	});

	socket.on('tx', function(data) {
		if (data.txlock) {
			console.log("New InstantSend transaction received: " + JSON.stringify(data));
		} else {
			console.log("New transaction received: " + JSON.stringify(data));
		}
	});
};


module.exports = {
	start: start
};