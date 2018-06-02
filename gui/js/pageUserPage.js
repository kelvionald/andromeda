Pages.UserPage = {
  template: '<div>{{loadData}} <div class="span5"> <label> <input v-on:change="changeAvatar2" type="file" style="position: fixed; top: -100em"> <img class="avatar" v-bind:src="avatar" v-on:click="stop" v-on:dblclick="changeAvatar" v-bind:title="title" ></img> </label> <button class="btn btn-success mybtn" v-bind:style="{display: isFriendable}" v-on:click="addAsFriend" >Добавить в друзья</button> <button class="btn btn-success mybtn" v-bind:style="{display: isAccept}" v-on:click="acceptFriend" >Принять в друзья</button> <button class="btn btn-danger mybtn" v-bind:style="{display: isUnfriendable}" v-on:click="removeFromFriends" >Удалить из друзей</button> <button class="btn btn-danger mybtn" v-bind:style="{display: isCancelFriends}" v-on:click="removeFromFriends" >Отменить запрос</button> </div> <div class="span6"> <h2 v-bind:title="location">{{nickname}}</h2> <p>{{status}}</p> <hr> <table class="table"> <tbody> <tr v-for="val, prop in aboutMe"> <td>{{prop}}:</td> <td>{{val}}</td> </tr> </tbody> </table> </div> </div>',
  data: function() {
    return {
      avatar: 'images/defaultAvatar.jpg',
      nickname: 'Nickname',
      status: 'Status',
      isFriendable: 'none',
      isUnfriendable: 'none',
      isCancelFriends: 'none',
      isAccept: 'none',
      aboutMe: {},
      oneUser: window.OneUser,
      twoUser: window.TwoUser,
      users: window.Users,
      friends: window.Friends,
      userData: window.UserData,
      currentUser: {},
      title: '',
      location: ''
    };
  },
  computed: {
    loadData: function() {
      var id, status;
      this.isFriendable = 'none';
      this.isUnfriendable = 'none';
      this.isCancelFriends = 'none';
      this.isAccept = 'none';
      if (this.users != null) {
        if ((this.$route.query.id != null) && (this.oneUser.id != null) && this.oneUser.id !== parseInt(this.$route.query.id)) {
          id = parseInt(this.$route.query.id);
          this.twoUser = this.users[id];
          this.viewUserData(this.twoUser);
          if (this.friends[id] != null) {
            status = this.friends[id].status;
            if (status === 0) {
              this.isCancelFriends = 'block';
              if (this.oneUser.id !== this.friends[id].one) {
                this.isAccept = 'block';
              }
            } else if (status === 1) {
              this.isUnfriendable = 'block';
            }
          } else {
            this.isFriendable = 'block';
          }
        } else {
          this.viewUserData(this.oneUser);
        }
      }
      return '';
    }
  },
  methods: {
    stop: function(e) {
      return e.preventDefault();
    },
    changeAvatar: function() {
      if (this.currentUser.id !== this.oneUser.id) {
        return;
      }
      return $('input[type="file"]').trigger('click');
    },
    changeAvatar2: function(e) {
      var data, files, reader;
      files = e.path[0].files;
      console.log(files);
      reader = new FileReader();
      data = this;
      reader.onload = function(e) {
        var newImage;
        console.log(files[0]);
        newImage = e.target.result;
        data.avatar = newImage;
        return api.method('users.setData', {
          one: data.oneUser.id,
          data: {
            avatar: newImage
          }
        });
      };
      return reader.readAsDataURL(files[0]);
    },
    viewUserData: function(viewUser) {
      if (Number(viewUser.nodeId) === 0) {
        this.location = 'Локальный';
      } else {
        this.location = viewUser.nodeId;
      }
      this.currentUser = viewUser;
      if (this.currentUser.id === this.oneUser.id) {
        this.title = 'Щелкните два раза, чтобы изменить аватарку.';
      }
      this.nickname = viewUser.nickname;
      if (this.userData[viewUser.id] != null) {
        if (this.userData[viewUser.id][3] != null) {
          this.status = this.userData[viewUser.id][3].value;
        }
        if (this.userData[viewUser.id][5] != null) {
          this.aboutMe['Пол'] = this.userData[viewUser.id][5].value;
        }
        if (this.userData[viewUser.id][7] != null) {
          this.aboutMe['Город'] = this.userData[viewUser.id][7].value;
        }
        if (this.userData[viewUser.id][4] != null) {
          this.aboutMe['День рождения'] = this.userData[viewUser.id][4].value;
        }
        if (this.userData[viewUser.id][8] != null) {
          return this.avatar = this.userData[viewUser.id][8].value;
        }
      }
    },
    existsData: function() {
      return (this.twoUser.id != null) && (this.oneUser.id != null) && this.oneUser.id !== this.twoUser.id;
    },
    addAsFriend: function() {
      if (this.existsData()) {
        return api.method('users.updateRelation', {
          one: this.oneUser.id,
          two: this.twoUser.id,
          status: 0
        });
      }
    },
    removeFromFriends: function() {
      if (this.existsData()) {
        return api.method('users.updateRelation', {
          one: this.oneUser.id,
          two: this.twoUser.id,
          status: -1
        });
      }
    },
    acceptFriend: function() {
      if (this.existsData()) {
        return api.method('users.updateRelation', {
          one: this.oneUser.id,
          two: this.twoUser.id,
          status: 1
        });
      }
    }
  }
};
