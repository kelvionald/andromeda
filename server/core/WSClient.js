module.exports = function WSClient (addr, port, callbacks) {
  var WebSocketClient = require('websocket').client;
  var client = new WebSocketClient();
  client.on('connectFailed', function (error) {
    //callbacks.onError(error.toString())
  });
  client.on('connect', function (connection) {
    connection.on('error', function (error) {
      callbacks.onError(connection, error.toString())
      console.log('client socket error ')
      console.log(connection.socket._peername.address.substring(7))
    });
    connection.on('close', function () {
      console.log('client socket close ')
      console.log(connection.socket._peername.address.substring(7))
    });
    connection.on('message', function (message) {
      callbacks.onMessage(connection, message.utf8Data)
    });
    connection.sendData = (data) => {
      connection.sendUTF(JSON.stringify(data));
    }
    callbacks.onConnected(connection)
  });
  client.connect('ws://' + addr + ':' + port + '/', 'echo-protocol');
}