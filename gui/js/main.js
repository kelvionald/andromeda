var Header, Navigation, NotFound, clearCache, concatComponents, router, routes;

Navigation = {
  template: '<ul class="span3 hidden-phone nav nav-tabs nav-stacked"> <li><router-link :class="{marker: style.i}" to="/i" exact>Моя страница</router-link></li> <li><router-link :class="{marker: style.friends}" to="/frineds">Друзья</router-link></li> <li><router-link :class="{marker: style.msg}" to="/msg">Сообщения</router-link></li> <li><router-link :class="{marker: style.people}" to="/people">Люди</router-link></li> <li><router-link :class="{marker: style.nodes}" to="/nodes">Узлы</router-link></li> </ul>',
  //<li><router-link :class="{marker: style.about}" to="/about">О проекте</router-link></li>
  data: function() {
    return {
      style: {
        i: false,
        friends: false,
        msg: false,
        people: false,
        about: false
      }
    };
  },
  watch: {
    $route: function(to, from) {}
  }
};

// for i of this.style
//   this.style[i] = false
// page = this.$route.path.substring(1)
// if !this.style[page]?
//   page = 'i'
// this.style[page] = true
NotFound = {
  template: '<h2>404</h2>'
};

Header = {
  template: '<header>{{load()}} <h1>Andromeda</h1> <img v-on:click="showOptions" class="options" src="images/options.png"></img> <div :style="{display: visibleOptions}" class="optionsForm"> <a v-on:click="showCreateUser">Создать пользователя</a> <div> Сменить пользователя на: <div v-for="local in localUsers"> <a v-on:click="setOneUser(local.id)">{{local.nickname}}</a> </div> </div> <hr> <div> Текущий пользователь: <label><input v-on:click="changeVisibleUser()" v-model="isGlobalUser" type="checkbox"/>Глобальная видимость</label> <label>Статус <br><input v-model="userStatus" type="text"/><button v-on:click="changeUserStatus()">.</button></label> <label>Город <br><input v-model="userCity" type="text"/><button v-on:click="changeUserCity()">.</button></label> <label>День рождения <br><input v-model="userDateBirth" type="text"/><button v-on:click="changeUserDateBirth()">.</button></label> <label>Пол <br> <select v-model="userGender" v-on:change="changeGender"> <option value=""></option> <option>Мужской</option> <option>Женский</option> <option>Другое</option> </select> </label> </div> </div> <h3 class="rigth">{{nickname}}</h3> </header>',
  data: function() {
    return {
      oneUser: window.OneUser,
      users: window.Users,
      userData: window.UserData,
      visibleOptions: 'none', 
      isGlobalUser: true,
      userStatus: '',
      userGender: '',
      userCity: '',
      userDateBirth: ''
    };
  },
  computed: {
    nickname: function() {
      if (this.oneUser.nickname != null) {
        return this.oneUser.nickname;
      }
      return '';
    },
    localUsers: function() {
      var i, localUsersPrep;
      localUsersPrep = {};
      for (i in this.users) {
        if (this.users[i].isLocal) {
          localUsersPrep[this.users[i].id] = this.users[i];
        }
      }
      return localUsersPrep;
    }
  },
  methods: {
    changeGender: function() {
      if (this.oneUser.id != null) {
        return api.method('users.setData', {
          one: this.oneUser.id,
          data: {
            gender: this.userGender
          }
        });
      }
    },
    changeUserDateBirth: function() {
      if (this.oneUser.id != null) {
        console.log({
          dateBirth: this.userDateBirth
        });
        return api.method('users.setData', {
          one: this.oneUser.id,
          data: {
            dateBirth: this.userDateBirth
          }
        });
      }
    },
    load: function() {
      var oneId;
      if ((this.oneUser.id != null) && (this.userData[this.oneUser.id] != null)) {
        oneId = this.oneUser.id;
        // глобальная видимость
        if (this.userData[oneId][2] != null) {
          this.isGlobalUser = Number(this.userData[oneId][2].value) ? true : false;
        }
      }
      return '';
    },
    changeVisibleUser: function() {
      this.isGlobalUser = !this.isGlobalUser;
      if (this.oneUser.id != null) {
        return api.method('users.setData', {
          one: this.oneUser.id,
          data: {
            displayGlobal: this.isGlobalUser ? 1 : 0
          }
        });
      }
    },
    changeUserStatus: function() {
      if (this.oneUser.id != null) {
        return api.method('users.setData', {
          one: this.oneUser.id,
          data: {
            status: this.userStatus
          }
        });
      }
    },
    changeUserCity: function() {
      if (this.oneUser.id != null) {
        return api.method('users.setData', {
          one: this.oneUser.id,
          data: {
            city: this.userCity
          }
        });
      }
    },
    showCreateUser: function() {
      if ($('.createUser').css('display') === 'block') {
        return $('.createUser').css('display', 'none');
      } else {
        return $('.createUser').css('display', 'block');
      }
    },
    showOptions: function() {
      return this.visibleOptions = this.visibleOptions === 'block' ? 'none' : 'block';
    },
    setOneUser: function(r) {
      return window.setOneUser(this.users[r]);
    }
  }
};

concatComponents = function(page) {
  return {
    default: Navigation,
    content: page,
    createUser: Pages.CreateUser,
    header: Header
  };
};

routes = [
  {
    path: '/',
    components: concatComponents(Pages.UserPage),
    children: [
      {
        path: 'i'
      }
    ],
    name: 'UserPage'
  },
  {
    path: '/frineds',
    components: concatComponents(Pages.Friends)
  },
  {
    path: '/msg',
    components: concatComponents(Pages.Messages),
    name: 'Messages'
  },
  {
    path: '/about',
    components: concatComponents(Pages.About)
  },
  {
    path: '/people',
    components: concatComponents(Pages.People)
  },
  {
    path: '/nodes',
    components: concatComponents(Pages.Nodes)
  },
  {
    path: '*',
    component: NotFound
  }
];

router = new VueRouter({
  mode: 'history',
  routes: routes
});

window.Dialogs = {};

window.Friends = {};

clearCache = function() {
  var i, j, len, ref, results;
  ref = Object.keys(window.Friends);
  results = [];
  for (j = 0, len = ref.length; j < len; j++) {
    i = ref[j];
    results.push(Vue.delete(window.Friends, i));
  }
  return results;
};

window.getData = function() {
  if (localStorage['data'] != null) {
    return JSON.parse(localStorage['data']);
  } else {
    return {};
  }
};

window.setData = function(data) {
  return localStorage['data'] = JSON.stringify(data);
};

window.setOneUser = function(user) {
  var data, i;
  data = window.getData();
  data.selectedUser = user.id;
  window.setData(data);
  clearCache();
  for (i in user) {
    Vue.set(window.OneUser, i, user[i]);
  }
  api.method('messages.getDialogs', {
    one: user.id
  });
  return api.method('users.getFriends', {
    one: user.id
  });
};

window.UserData = {};

window.UsersData = {};

window.Nodes = {};

window.main = function() {
  var app;
  api.method('users.get');
  api.method('nodes.get');
  return app = new Vue({
    el: '#app',
    router: router,
    data: {
      friends: window.Friends
    },
    template: '<div> <router-view name="header"></router-view> <div class="row-fluid show-grid"> <router-view></router-view> <div class="span9 content"> <router-view name="content"></router-view> </div> </div> <router-view name="createUser"></router-view> </div>'
  });
};
