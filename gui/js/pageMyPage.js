Pages.UserPage = {
  template: '<div> <div class="span6"> <img v-bind:src="avatar"></img> </div> <div class="span6"> <h2>{{nickname}}</h2> <table class="table"> <tbody> <tr v-for="val, prop in aboutMe"> <td>{{prop}}:</td> <td>{{val}}</td> </tr> </tbody> </table> </div> </div>',
  data: function() {
    return {
      avatar: 'images/defaultAvatar.jpg',
      nickname: 'Nickname',
      aboutMe: {
        'День рождения': '25 сентября',
        'Город': 'Йошкар-Ола',
        'Языки': 'Русский'
      }
    };
  }
};
