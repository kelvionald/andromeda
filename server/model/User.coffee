Database = require('./Database.coffee')

User = (obj) ->
  # status: 0 - request for friends, 1 - friends, 2 - blacklist
  this.table = 'Users'
  # this.defaults =
  #   one: 0
  #   two: 0
  #   status: 0
  self = this
  (new Database()).copy(this)

  if obj
    for i of obj
      this[i] = obj[i]

  false

module.exports = User