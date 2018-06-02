window.api = new (() ->
  socket = null
  timerId = null
  this.methods = {}
  this.currentGroup = ''
  methods = this.methods

  initConnection = () ->
    addr = "ws://127.0.0.1:9001"
    protocol = 'echo-protocol'
    socket = new WebSocket(addr, protocol)
    socket.onopen = () ->
      window.main()
      console.log("Соединение установлено.")
    socket.onclose = (event) ->
      console.log("Соединение закрыто.")
      setTimeout(() ->
        console.log 'Попытка соединения'
        initConnection()
      , 1000)
    socket.onmessage = (event) ->
      data = JSON.parse(event.data)
      methods[data.request.method].callback data
    socket.onerror = (error) -> 
      console.log("Ошибка " + error.message)
  initConnection()

  this.method = (methodName, params, callback) ->
    method = this.methods[methodName]
    query = {
      method: methodName
      params: if params 
                params
              else
                {}
    }
    socket.send(JSON.stringify(query))
  this.group = (groupName, callback) ->
    this.currentGroup = groupName
    callback()
    this.currentGroup = ''
  this
)

api.methods['messages.send'] = {
  callback: (resp) ->
    id = resp.message.id
    if resp.message.one == resp.message.two
      second = resp.message.one
    else
      second = if resp.message.one == window.OneUser.id
        resp.message.two
      else
        resp.message.one
    Vue.set(window.Messages[second], id, resp.message)
    # hack
    api.method('messages.getDialogs', {one: window.OneUser.id})
}

api.methods['messages.getDialogs'] = {
  callback: (resp) ->
    for dialog in resp.dialogs
      Vue.set(window.Dialogs, dialog.second, dialog)
}

api.methods['messages.getDialog'] = {
  callback: (resp) ->
    second = resp.request.params.two
    tmp = {}
    for dlg in resp.dialog
      tmp[dlg.id] = dlg
    Vue.set(window.Messages, second, tmp)
}


api.methods['users.get'] = {
  callback: (resp) ->
    users = resp.users
    isFoundLocal = false
    firstLocalUser = null
    idsArr = []
    for user in users
      Vue.set(window.Users, user.id, user)
      if !isFoundLocal && user.isLocal
        isFoundLocal = true
        firstLocalUser = user
      idsArr.push user.id
    api.method('users.getData', {arr: idsArr})
    if !isFoundLocal
      $('.createUser').css('display', 'block')
    else
      data = window.getData()
      if data.selectedUser?
        window.setOneUser(window.Users[data.selectedUser])
      else
        window.setOneUser(firstLocalUser)
}

prepareUserData = (resp) ->
  # console.log resp
  tmp = {}
  for i of resp.userData
    userData = resp.userData[i]
    if !tmp[userData.userId]?
      tmp[userData.userId] = {}
    tmp[userData.userId][userData.typeId] = userData
  for id of tmp
    Vue.set(window.UserData, id, tmp[id])

api.methods['users.getData'] = {
  params: {}
  callback: prepareUserData
}

api.methods['users.create'] = {
  callback: (resp) ->
    location.reload()
}

api.methods['users.getFriends'] = {
  callback: (resp) ->
    for i of resp.friends
      Vue.set(window.Friends, i, resp.friends[i])
}

api.methods['users.updateRelation'] = {
  callback: (resp) ->
    if resp.request.params.status == -1
      for i of window.Friends
        if window.Friends[i].id == resp.deleteRelation
          Vue.delete(window.Friends, i)
    else if resp.relation.status == 0
      key = if window.OneUser.id == resp.relation.one then resp.relation.two else resp.relation.onw
      Vue.set(window.Friends, key, resp.relation)
    else if resp.relation.status == 1
      key = if window.OneUser.id == resp.relation.one then resp.relation.two else resp.relation.onw
      console.log window.Friends, key
      Vue.set(window.Friends[key], 'status', resp.relation.status)
}

api.methods['users.setData'] = {
  callback: prepareUserData
}

api.methods['nodes.add'] = {
  callback: (resp) ->
    api.method('nodes.get')
}

api.methods['nodes.get'] = {
  callback: (resp) ->
    for id in Object.keys(window.Nodes)
      Vue.delete(window.Nodes, id)
    for i of resp.nodes
      id = resp.nodes[i].id
      Vue.set(window.Nodes, id, resp.nodes[i])
}

api.methods['nodes.remove'] = {
  callback: (resp) ->
    api.method('nodes.get')
}