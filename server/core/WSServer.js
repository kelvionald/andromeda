module.exports = function WSServer (port, callbacks) {
  var WebSocketServer = require('websocket').server;
  var http = require('http');
  var server = http.createServer(function (request, response) {
    response.writeHead(404);
    response.end();
  });
  server.listen(port, function () {});
  wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
  });
  this.connections = {}
  wsServer.on('request', function (request) {
    connections = this.connections
    var connection = request.accept('echo-protocol', request.origin);
    connection.sendData = (data) => {
      connection.sendUTF(JSON.stringify(data))
    }
    // console.log('connection')
    // console.log(connection.socket._peername)
    
    let key = connection.remoteAddress
    connections[key] = connection
    connection.on('message', function (message) {
      callbacks.onMessage(connection, message.utf8Data)
    });
    connection.on('close', function (reasonCode, description) {
      console.log('socket close 1 ')
      console.log(connection.socket._peername.address.substring(7))
    });
    connection.on('error', function (reasonCode, description) {
      console.log('socket error 1 ')
      console.log(connection.socket._peername.address.substring(7))
    });
  });
}