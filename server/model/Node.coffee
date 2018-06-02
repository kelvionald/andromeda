Database = require('./Database.coffee')

Relationships = (obj) ->
  this.table = 'Nodes'
  this.defaults =
    ip: '0.0.0.0'
    port: 0
    isStatic: false
    lifetime: 0
  self = this
  (new Database()).copy(this)

  if obj
    for i of obj
      this[i] = obj[i]

  false

module.exports = Relationships
