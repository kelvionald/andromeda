Database = require('./Database.coffee')

Messages = () ->
  this.table = 'Messages'
  this.defaults =
    one: 0
    two: 0
    text: 'sg'
    delivered: 0
    time: 0
  self = this
  this.getDialog = () ->
    new Promise((resolve) ->
      returnRows = (err, rows) ->
        if err
          console.log(err)
          return
        resolve(rows)
      if self.one == self.two
        db.all("
          SELECT * 
          FROM Messages 
          WHERE 
            one = " + self.one + " AND 
            two = one",
          returnRows
        )
      else
        inCond = " IN (" + self.one + "," + self.two + ") "
        db.all("
          SELECT * 
          FROM Messages 
          WHERE 
            one " + inCond + " AND 
            two " + inCond + " AND 
            two != one",
          returnRows
        )
    )
  this.getDialogs = () ->
    new Promise((resolve) ->
      db.all('
        SELECT *, '  + ' 
          CASE '  + ' 
            WHEN one < two THEN one '  + ' 
            ELSE two '  + ' 
          END first '  + ',
          CASE '  + '
            WHEN one < two THEN two '  + '
            ELSE one '  + '
          END second '  + '
        FROM ' + self.table + ' '  + '
        WHERE 
          (one = ' + self.one + ' AND two != ' + self.one + ' ) OR '  + ' 
          (one != ' + self.one + ' AND two = ' + self.one + ' ) OR '  + ' 
          (one = ' + self.one + ' AND two = ' + self.one + ' ) '  + ' 
        GROUP BY first, second '  + ' 
        ORDER BY id DESC',
      (err, rows) ->
        if err
          console.log(err)
          return
        resolve(rows)
      )
    )
  (new Database()).copy(this)
  false

module.exports = Messages
