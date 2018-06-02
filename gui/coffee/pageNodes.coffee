Pages.Nodes = 
  template: '
    <div>
      <div>
        <span>Ip <input v-model="ip"></span>
        <span>Port <input v-model="port"></span>
        <button v-on:click="add">+</button>
        <!--button v-on:click="find">Найти</button>
        <button v-on:click="reset">Сброс</button-->
      </div>
      <div>
        <div v-for="node in nodes">
          #{{node.id}} {{node.ip}}:{{node.port}}
          <button v-on:click="remove(node.id)">Удалить узел</button>
          <button v-on:click="removeData(node.id)">Удалить данные</button>
          <button v-on:click="sync(node.ip, node.port)">Загрузить</button>
          <hr>
        </div>
      </div>
    </div>'
  data: () ->
    ip: '0.0.0.0'
    port: 0
    nodes: window.Nodes
  methods:
    add: () ->
      api.method('nodes.add', {ip: this.ip, port: this.port})
    remove: (id) ->
      api.method('nodes.remove', {id: id})
    sync: (ip, port) ->
      api.method('nodes.sync', {ip: ip, port: port})
    removeData: (id) ->
      api.method('nodes.removeData', {id: id})