Vue.component 'human', {
  template: '
    <router-link :to="{ name: \'UserPage\', query: { id: user.id }}">
      <div v-bind:id="user.id">
        {{user.nickname}}
        <div class="min">{{location}}</div>
      </div>
    </router-link>'
  props: ['user']
  computed:
    location: () ->
      return if Number(this.user.nodeId) == 0 then "Локальный" else this.user.nodeId
}

Pages.People = 
  template: '<div>
              <human v-for="user in people" :key="user.id" v-bind:user="user"></human>
            </div>'
  data: () ->
    users: window.Users
    userData: window.UserData
  computed:
    people: () ->
      if this.users
        arr = []
        for i of this.users
          arr.push(this.users[i].id)
        if arr.length
          api.method('users.getData', {arr: arr})
      return this.users