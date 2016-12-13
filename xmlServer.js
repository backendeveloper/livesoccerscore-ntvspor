var parser = new require('xml2json'),
fs = require('fs');

function XMLServer(socket) {
	this.socketsrv = socket;
}

XMLServer.prototype.name = 'XMLServer';
XMLServer.prototype.description = 'Reads from XML';
XMLServer.prototype.constructor = XMLServer;

XMLServer.prototype.connect = function () {
	var filePath = __dirname + '/livescore.xml';
	console.log(__dirname);
	socket = this.socketsrv;
	// watching the xml file
	fs.watchFile(filePath, function (curr, prev) {
		// on file change we can read the new xml
		fs.readFile(filePath, 'utf8', function (err, data) {
			if (err)
				throw err;
			console.log("File Changed");
			// parsing the new xml data
			var json = parser.toJson(data);
			// send data to the client
			socket.volatile.emit('notification', json);
		});
	});
}

exports.XMLServer = XMLServer;
