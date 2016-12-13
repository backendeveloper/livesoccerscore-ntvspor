var http = require('http'),
path = require('path'),
express = require('express'),
path = require('path'),
jsonServer = require('./jsonServer').JSONServer,
jsonDataProvider = require('./ntvspor'),
app = express();

var server = http.Server(app),
io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

var __port = 3300;

app.get('/', function (req, res) {
	var fileName = __dirname + '/public/scores.html';
	res.sendFile(fileName);
})

server.listen(__port);
console.log("server is listening on port" + __port);

this.jsonDataProvider = jsonDataProvider;

// creating  a new websocket
io.sockets.on('connection', function (socket) {
	this.srv = new jsonServer(socket);
	this.srv.connect();
});
