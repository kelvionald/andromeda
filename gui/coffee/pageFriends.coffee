Vue.component 'friend', {
  template: '
    <router-link :to="{ name: \'UserPage\', query: { id: friend.id }}">
      <div v-bind:id="friend.id">
        {{friend.nickname}}
        <div class="min">{{friend.status}}</div>
        <a v-on:click="accept" :style="{display: friend.clickable ? \'block\' : \'none\'}">Принять</a>
      </div>
    </router-link>'
  props: ['friend']
  methods:
    accept: () ->
      api.method('users.updateRelation', {
        one: window.OneUser.id, 
        two: this.friend.id, 
        status: 1
      })
}

Pages.Friends = 
  template: '<div>
              <friend
                v-for="friend in friendsPrep" :key="friend.id" 
                v-bind:friend="friend"
              ></friend>
            </div>'
  data: () ->
    friends: window.Friends
    users: window.Users
    oneUser: window.OneUser
  computed:
    friendsPrep: () ->
      prep = {}
      for i of this.friends
        id = this.users[i].id
        status = this.friends[i].status
        clickable = false
        status = 
          if status == 0
            if parseInt(i) == this.friends[i].one
              clickable = true
              'Ожиданет принятия'
            else
              'Ожидание'
          else if status == 1
            'Друг'
        if status == 2 # in blacklist
          continue
        prep[id] = {
          id: id
          nickname: this.users[i].nickname
          status: status
          clickable: clickable
        }
      return prep