var common, eventBus;

Vue.component('message', {
  template: '<div v-bind:id="id">{{nickname}}: {{text}}</div>',
  props: ['id', 'text', 'nickname']
});

eventBus = new Vue();

window.OneUser = {};

window.TwoUser = {};

window.Users = {};

window.Messages = {};

window.UserData = {};

common = {
  text: '',
  dialogId: 1,
  messages: window.Messages,
  users: window.Users,
  oneUser: window.OneUser,
  twoUser: window.TwoUser
};

Vue.component('messages', {
  template: '<div class="messagesBox"> <h4>{{twoUser.nickname}}</h4> <message ref="messages" v-for="msg in messagesPrep" :key="msg.id" v-bind:id="msg.id" v-bind:nickname="users[msg.one].nickname" v-bind:text="msg.text" ></message> </div>',
  data: function() {
    return common;
  },
  methods: {
    changeDialog: function(userId) {
      if (this.users[userId] != null) {
        this.twoUser = this.users[userId];
        return api.method('messages.getDialog', {
          one: this.oneUser.id,
          two: this.twoUser.id
        });
      } else {
        return console.log('Error: userId not found in Users');
      }
    }
  },
  computed: {
    messagesPrep: function() {
      if (this.twoUser.id != null) {
        return this.messages[this.twoUser.id];
      }
      return {};
    }
  },
  created: function() {
    return eventBus.$on("changeDialog", this.changeDialog);
  }
});

Vue.component('dialogue', {
  template: '<router-link :to="{ name: \'Messages\', query: { id: id }}"> <div class="dlg" v-bind:id="id" v-on:click="changeDialog" > <span class="small">{{second}}</span> {{nickname}}: {{text}} </div> </router-link>',
  props: ['id', 'text', 'nickname', 'dlg'],
  methods: {
    changeDialog: function() {
      eventBus.$emit("changeDialog", this.id);
      return console.log(this.dlg);
    }
  },
  computed: {
    second: function() {
      return window.Users[this.dlg.second].nickname;
    }
  }
});

Vue.component('dialogues', {
  template: '<div> <dialogue v-for="dlg in dialogsPrep" :key="dlg.id" v-bind:id="dlg.id" v-bind:text="dlg.text" v-bind:nickname="dlg.nickname" v-bind:dlg="dlg" ></dialogue></div>',
  data: function() {
    return {
      dialogs: window.Dialogs,
      users: window.Users
    };
  },
  methods: {
    update: function() {
      var dlg, dlgs, k, ref;
      dlgs = {};
      ref = this.dialogs;
      for (k in ref) {
        dlg = ref[k];
        // dlgs[k]
        dlgs[k] = {
          id: k,
          text: dlg.text,
          nickname: this.users[dlg.one].nickname,
          second: dlg.second
        };
      }
      return dlgs;
    }
  },
  // for test 
  //  Vue.set( Dialogs[1], 4, {id:4, one:2, text:'3srfgbsg'} )
  //  Vue.set( Users[1], 'nickname', 'xaxa' )
  computed: {
    dialogsPrep: function() {
      return this.update();
    }
  }
});

Vue.component('twoUser', {
  template: '<div v-on:click="selectUser">{{user.nickname}}</div>',
  props: ['user'],
  methods: {
    selectUser: function() {
      return eventBus.$emit("changeDialog", this.user.id);
    }
  }
});

Vue.component('messageSender', {
  template: '<div> <form class="row-fluid show-grid" @submit="sendMessage"> <div class="span11"> <input v-model="text" type="text" class="form-control textInput"> </div> <div class="span1"><button type="submit" class="btn btn-primary">></button></div> </form> </div>',
  props: ['user'],
  data: function() {
    return common;
  },
  methods: {
    sendMessage: function(e) {
      e.preventDefault();
      if ((this.twoUser.id != null) && this.twoUser.id) {
        // console.log(this.text, this.oneUser, this.twoUser)
        api.method('messages.send', {
          text: this.text,
          one: this.oneUser.id,
          two: this.twoUser.id
        });
        return this.text = '';
      } else {
        console.log('Error: not set twoUser');
        return alert('Не выбран диалог!');
      }
    }
  }
});

Pages.Messages = {
  template: '<div> <ul class="span4 nav nav-tabs nav-stacked dialogs"> <button v-on:click="createDialog">+</button> <div> <div :style="{display: visibleCreateDialog}" v-for="user in users"> <twoUser v-bind:user="user"></twoUser> </div> </div> <dialogues></dialogues> </ul> <div class="span8 messages"> <messages></messages> <messageSender></messageSender> </div> </div>',
  data: function() {
    return {
      users: window.Users,
      visibleCreateDialog: 'none'
    };
  },
  methods: {
    createDialog: function() {
      return this.visibleCreateDialog = 'none' === this.visibleCreateDialog ? 'block' : 'none';
    }
  }
};
