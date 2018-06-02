Database = () ->
  # Возвращает значения строки БД
  this.getVals = () ->
    obj = {}
    obj.id = self.id
    for i of this.defaults
      if self[i]?
        obj[i] = self[i]
      else
        obj[i] = self.defaults[i]
    return obj
  # Выполняет либо запись либо обновление строки в БД
  this.save = () ->
    self = this
    # Используются обещания для синхронизации асинхронных запросов
    new Promise((resolve) ->
      db = global.db
      # При отсутствии идентификатора запись считается еще не занесенной
      if !self.id?
        fields = []
        values = []
        for i of self.defaults
          if self[i]?
            value = self[i]
          else
            value = self.defaults[i]
          fields.push(i)
          values.push('"' + value + '"')
        db.run(
          "INSERT INTO " + self.table + " (" + fields.join(',') + ") " +
          "VALUES (" + values.join(',') + ")"
        )
        db.get("SELECT * FROM " + self.table + " WHERE id = last_insert_rowid()", (err, row) ->
          self.id = row.id
          resolve(row)
        )
      else
        parts = []
        for i of self.defaults
          if self[i]?
            value = self[i]
          else
            value = self.defaults[i]
          parts.push('`' + i + '` = "' + value + '"')
        db.run(
          "UPDATE " + self.table + " " +
          "SET " + parts.join(', ') + " " +
          "WHERE id = " + self.id
        )
        db.get("SELECT * FROM " + self.table + " WHERE id = " + self.id, (err, row) ->
          resolve(row)
        )
    )
  # Быворка данных
  this.select = (whereCond) ->
    self = this
    new Promise((resolve) ->
      if whereCond
        whereCond = " WHERE " + whereCond
      else
        whereCond = ''
      db.all("
        SELECT * 
        FROM " + self.table + " " + whereCond,
        (err, rows) ->
          if err
            console.log(err)
            return
          resolve(rows)
      )
    )
  # Удаление строки
  this.remove = () ->
    self = this
    db = global.db
    if self.id?
      db.run(
        "DELETE FROM " + self.table +
        " WHERE id = " + self.id
      )
    else
      console.log('error delete')
  # Функция копирования функционала для классов наследников
  this.copy = (obj) ->
    for a in Object.keys(this)
      if a == 'copy'
        continue
      obj[a] = this[a]
  false

module.exports = Database