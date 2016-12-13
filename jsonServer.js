 var  fs = require('fs');

function JSONServer(socket)
{
	this.socketsrv=socket;
}
  
JSONServer.prototype.name = 'JSONServer';
JSONServer.prototype.description = 'Reads from JSON';
JSONServer.prototype.constructor=JSONServer;


JSONServer.prototype.connect=function (){
  var filePath=__dirname+'/livescore.json';
  console.log(__dirname);
  socket=this.socketsrv;
  // watching the xml file
  fs.watchFile(filePath , function(curr, prev) {
    // on file change we can read the new xml
    fs.readFile(filePath,  'utf8',function(err, data) {
      if (err) throw err;
	  console.log("File Changed at "+new Date());

      // send data to the client
      socket.volatile.emit('notification', data);
    });
  });
}

exports.JSONServer = JSONServer;