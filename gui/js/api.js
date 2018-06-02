var prepareUserData;

window.api = new (function() {
  var initConnection, methods, socket, timerId;
  socket = null;
  timerId = null;
  this.methods = {};
  this.currentGroup = '';
  methods = this.methods;
  initConnection = function() {
    var addr, protocol;
    addr = "ws://127.0.0.1:9001";
    protocol = 'echo-protocol';
    socket = new WebSocket(addr, protocol);
    socket.onopen = function() {
      window.main();
      return console.log("Соединение установлено.");
    };
    socket.onclose = function(event) {
      console.log("Соединение закрыто.");
      return setTimeout(function() {
        console.log('Попытка соединения');
        return initConnection();
      }, 1000);
    };
    socket.onmessage = function(event) {
      var data;
      data = JSON.parse(event.data);
      return methods[data.request.method].callback(data);
    };
    return socket.onerror = function(error) {
      return console.log("Ошибка " + error.message);
    };
  };
  initConnection();
  this.method = function(methodName, params, callback) {
    var method, query;
    method = this.methods[methodName];
    query = {
      method: methodName,
      params: params ? params : {}
    };
    return socket.send(JSON.stringify(query));
  };
  this.group = function(groupName, callback) {
    this.currentGroup = groupName;
    callback();
    return this.currentGroup = '';
  };
  return this;
});

api.methods['messages.send'] = {
  callback: function(resp) {
    var id, second;
    id = resp.message.id;
    if (resp.message.one === resp.message.two) {
      second = resp.message.one;
    } else {
      second = resp.message.one === window.OneUser.id ? resp.message.two : resp.message.one;
    }
    Vue.set(window.Messages[second], id, resp.message);
    // hack
    return api.method('messages.getDialogs', {
      one: window.OneUser.id
    });
  }
};

api.methods['messages.getDialogs'] = {
  callback: function(resp) {
    var dialog, j, len, ref, results;
    ref = resp.dialogs;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      dialog = ref[j];
      results.push(Vue.set(window.Dialogs, dialog.second, dialog));
    }
    return results;
  }
};

api.methods['messages.getDialog'] = {
  callback: function(resp) {
    var dlg, j, len, ref, second, tmp;
    second = resp.request.params.two;
    tmp = {};
    ref = resp.dialog;
    for (j = 0, len = ref.length; j < len; j++) {
      dlg = ref[j];
      tmp[dlg.id] = dlg;
    }
    return Vue.set(window.Messages, second, tmp);
  }
};

api.methods['users.get'] = {
  callback: function(resp) {
    var data, firstLocalUser, idsArr, isFoundLocal, j, len, user, users;
    users = resp.users;
    isFoundLocal = false;
    firstLocalUser = null;
    idsArr = [];
    for (j = 0, len = users.length; j < len; j++) {
      user = users[j];
      Vue.set(window.Users, user.id, user);
      if (!isFoundLocal && user.isLocal) {
        isFoundLocal = true;
        firstLocalUser = user;
      }
      idsArr.push(user.id);
    }
    api.method('users.getData', {
      arr: idsArr
    });
    if (!isFoundLocal) {
      return $('.createUser').css('display', 'block');
    } else {
      data = window.getData();
      if (data.selectedUser != null) {
        return window.setOneUser(window.Users[data.selectedUser]);
      } else {
        return window.setOneUser(firstLocalUser);
      }
    }
  }
};

prepareUserData = function(resp) {
  var i, id, results, tmp, userData;
  // console.log resp
  tmp = {};
  for (i in resp.userData) {
    userData = resp.userData[i];
    if (tmp[userData.userId] == null) {
      tmp[userData.userId] = {};
    }
    tmp[userData.userId][userData.typeId] = userData;
  }
  results = [];
  for (id in tmp) {
    results.push(Vue.set(window.UserData, id, tmp[id]));
  }
  return results;
};

api.methods['users.getData'] = {
  params: {},
  callback: prepareUserData
};

api.methods['users.create'] = {
  callback: function(resp) {
    return location.reload();
  }
};

api.methods['users.getFriends'] = {
  callback: function(resp) {
    var i, results;
    results = [];
    for (i in resp.friends) {
      results.push(Vue.set(window.Friends, i, resp.friends[i]));
    }
    return results;
  }
};

api.methods['users.updateRelation'] = {
  callback: function(resp) {
    var i, key, results;
    if (resp.request.params.status === -1) {
      results = [];
      for (i in window.Friends) {
        if (window.Friends[i].id === resp.deleteRelation) {
          results.push(Vue.delete(window.Friends, i));
        } else {
          results.push(void 0);
        }
      }
      return results;
    } else if (resp.relation.status === 0) {
      key = window.OneUser.id === resp.relation.one ? resp.relation.two : resp.relation.onw;
      return Vue.set(window.Friends, key, resp.relation);
    } else if (resp.relation.status === 1) {
      key = window.OneUser.id === resp.relation.one ? resp.relation.two : resp.relation.onw;
      console.log(window.Friends, key);
      return Vue.set(window.Friends[key], 'status', resp.relation.status);
    }
  }
};

api.methods['users.setData'] = {
  callback: prepareUserData
};

api.methods['nodes.add'] = {
  callback: function(resp) {
    return api.method('nodes.get');
  }
};

api.methods['nodes.get'] = {
  callback: function(resp) {
    var i, id, j, len, ref, results;
    ref = Object.keys(window.Nodes);
    for (j = 0, len = ref.length; j < len; j++) {
      id = ref[j];
      Vue.delete(window.Nodes, id);
    }
    results = [];
    for (i in resp.nodes) {
      id = resp.nodes[i].id;
      results.push(Vue.set(window.Nodes, id, resp.nodes[i]));
    }
    return results;
  }
};

api.methods['nodes.remove'] = {
  callback: function(resp) {
    return api.method('nodes.get');
  }
};
