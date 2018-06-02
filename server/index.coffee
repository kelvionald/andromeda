Server = require("./core/Server.js")
global.Types = require('./model/Types.coffee')
require('./core/Database.js')

Users    = require("./model/Users.coffee")
User     = require("./model/User.coffee")
Messages = require("./model/Messages.coffee")
Node     = require("./model/Node.coffee")
Relationships = require("./model/Relationships.coffee")

global.server = new Server 9001, (conn, data) ->
  request = JSON.parse(data)
  console.log('request:')
  console.log(request)
  method = request.method
  params = request.params

  relay = (two, data) ->
    user = new User()
    user2 = await user.select("id = '" + two + "'")
    # local
    if Number(user2[0].nodeId) == 0
      conn.sendData(data)
    else if user2[0].nodeId
      node = new Node()
      node = await node.select("id = '" + user2[0].nodeId + "'")
      console.log(node)
      data.relay = true
      # //
      global.server.sendData( node.ip, node.port, data )

  createNode = (ip, port) ->
    node = new Node()
    node.ip = ip
    node.port = port
    nodeRows = await node.select('ip = "' + ip + '" AND port = ' + port)
    if (nodeRows.length == 0)
      node = new Node()
      node.ip = ip
      node.port = port
      nodeRows = await node.save()
    return nodeRows

  methods = 
    'messages.send': () ->
      m = new Messages()
      m.text = params.text
      m.one  = params.one
      m.two  = params.two
      m = await m.save()
      user = new User()

      relay(params.two, {
        request: request
        message: m
      })
    'messages.getDialog': () ->
      m = new Messages()
      m.one  = params.one
      m.two  = params.two
      dialog = await m.getDialog()
      conn.sendData(
        request: request
        dialog: dialog
      )
    'messages.getDialogs': () ->
      m = new Messages()
      m.one  = params.one
      dialogs = await m.getDialogs()
      conn.sendData(
        request: request
        dialogs: dialogs
      )

    'users.get': () ->
      conn.sendData(
        request: request
        users: await Users.getAll()
      )
    'users.create': () ->
      user = await Users.create(params.nickname, params.password)
      conn.sendData(
        request: request
        user: user
      )
    'users.getData': () ->
      conn.sendData(
        request: request
        userData: await Users.getData(params.arr)
      )
    'users.getFriends': () ->
      relation = new Relationships()
      relations = await relation.select('one = "' + params.one + '" OR two = "' + params.one + '"')
      tmp = {}
      for relation in relations
        second = if parseInt(relation.one) == parseInt(params.one) then relation.two else relation.one
        tmp[second] = relation
      conn.sendData(
        request: request
        friends: tmp
      )
    'users.setData': () ->
      await Users.setData(params.one, params.data)
      conn.sendData(
        request: request
        userData: await Users.getData([params.one])
      )
      for row of params.data
        if row == 'displayGlobal'
          if params.data[row]
            # create user to net
            # params.one
          else
            # delete user from net
    'users.updateRelation': () ->
      fn = (row) ->
        console.log row
        if parseInt(row.status) == parseInt(params.status)
          return
        row.status = params.status
        relation = new Relationships(row)
        console.log 'relation', relation
        if parseInt(params.status) == -1
          relation.remove()
          relay(params.two, {
            request: request
            deleteRelation: relation.id
          })
        else
          result = await relation.save()
          relay(params.two, {
            request: request
            relation: result
          })
      relation = new Relationships()
      relation.one = params.one
      relation.two = params.two
      relation.status = 0
      results = await relation.select(
        "one = '" + params.one + "' AND two = '" + params.two + "'")
      if results.length
        fn(results[0])
        return
      results = await relation.select(
        "one = '" + params.two + "' AND two = '" + params.one + "'")
      if results.length
        fn(results[0])
        return
      result = await relation.save()
      relay(params.two, {
        request: request
        relation: result
      })
    'nodes.add': () ->
      node = await createNode(params.ip, params.port)
      conn.sendData(
        request: request
        node: node
      )
    'nodes.get': () ->
      node = new Node()
      conn.sendData(
        request: request
        nodes: await node.select()
      )
    'nodes.remove': () ->
      node = new Node()
      node.id = params.id
      node.remove()
      conn.sendData(
        request: request
        status: 'ok'
      )
    'nodes.sync': () ->
      global.server.sendData( params.ip, params.port, {method: 'users.get'} )
    # 'nodes.removeData': () ->
      

  if request.request?
    if request.request.method == 'users.get'
      ip = conn.socket._peername.address
      port = conn.socket._peername.port
      node = await createNode(ip, port)
      console.log node
  else if methods[method]?
    methods[method]()
    return
  else
    console.log 'Error: not found method'

ft = () ->
  # global.server.sendData(
  #   'localhost', 9001, {
  #     method: 'nodes.get'
  #   }
  # )
  # global.server.sendData(
  #   'localhost', 9001, {
  #     method: 'nodes.add'
  #     params: {
  #       ip: '123.312.153.22'
  #       port: 9022
  #     }
  #   }
  # )
  # global.server.sendData(
  #   'localhost', 9001, {
  #     method: 'messages.send'
  #     params:
  #       one: 2
  #       two: 1
  #       text: 'wrgfwr'
  #   }
  # )
  # global.server.sendData(
  #   'localhost', 9001, {
  #     method: 'users.setData'
  #     params:
  #       one: 2
  #       data: {displayGlobal: 1}
  #   }
  # )
  # setTimeout(() ->
  #   global.server.sendData(
  #     'localhost', 9001, {
  #       method: 'users.getFriends'
  #       params:
  #         one: 2
  #     }
  #   )
  # , 100)

setTimeout(ft, 100)