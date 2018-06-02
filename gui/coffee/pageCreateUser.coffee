Pages.CreateUser = 
  template: '
    <div class="createUser">
      <form class="container" @submit="checkForm">
        <div v-on:click="visibleCreateUser">X</div>
        <h2>Регистрация</h2>
        <div class="form-group">
          <label for="exampleInputEmail1">Псевдоним</label>
          <input v-model="nickname" type="text" class="form-control">
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Пароль</label>
          <input v-model="password" type="text" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Создать</button>
      </form>
    </div>'
  data: () ->
    nickname: ''
    password: ''
  methods:
    visibleCreateUser: () ->
      if $('.createUser').css('display') == 'block'
        $('.createUser').css('display', 'none')
      else
        $('.createUser').css('display', 'block')
    checkForm: (e) -> 
      e.preventDefault()
      this.errors = []
      if this.nickname.length < 3
        alert('Никнейм должен быть длиннее')
        return
      if this.password.length < 3
        alert('Пароль должен быть длиннее')
        return
      api.method('users.create', {
        nickname: this.nickname
        password: this.password
      })