Database = require('./Database.coffee')

Relationships = (obj) ->
  # status: 0 - request for friends, 1 - friends, 2 - blacklist
  this.table = 'Relationships'
  this.defaults =
    one: 0
    two: 0
    status: 0
  self = this
  (new Database()).copy(this)

  if obj
    for i of obj
      this[i] = obj[i]

  # this.createRelation = () ->
  #   results = await self.select(
  #     "one = '" + self.one + "' AND two = '" + self.two + "'")
  #   if results.length
  #     return results[0]
  #   results = await self.select(
  #     "one = '" + self.two + "' AND two = '" + self.one + "'")
  #   if results.length
  #     return results[0]
  #   return await self.save()
  false

module.exports = Relationships
