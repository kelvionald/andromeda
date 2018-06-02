// Импорт модуля клиента WebSocket
const WSClient = require('./WSClient')
// Импорт модуля сервера WebSocket
const WSServer = require('./WSServer')
// Экспорт текущего модуля
module.exports = function Server (serverPort, onMessage) {

  // Инициализация сервера WebSocket
  this.server = new WSServer(serverPort, {
    'onMessage': onMessage
  })

  // Создание ассоциативного массива для сохранения подключений
  const connections = {}
  // Функция отправки данных заданному узлу
  this.sendData = (addr, port, data) => {
    // ссылка на подключения
    const connsLink = connections
    // Формирование ключа для быстрого поиска подключения
    let key = addr + ':' + port
    // Поиск подключения
    if (key in connections){
      // Если найдено то происходит отправка данных
      connections[key].sendData(data)
    }
    else{
      // Создание подключения
      new WSClient(addr, port, {
        onConnected: (conn) => {
          // Добавление нового подключения и отправка
          connsLink[key] = conn
          conn.sendData(data)
        },
        onMessage: onMessage,
        onError: (errStr, conn) => {
          // При ошибке подключение будет очищено
          delete connections[key]
        }
      })
    }
  }
}