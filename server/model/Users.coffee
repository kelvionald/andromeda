Crypto = require('../core/Crypt.js')
sha256 = require('sha256')

module.exports = 
  getAll: () ->
    new Promise((resolve) ->
      db.all("
        select * 
        from Users"
      , (err, rows) ->
        if err
          console.log(err);
          return
        resolve(rows)
      )
    )
  getData: (userIdArr) ->
    new Promise((resolve) ->
      userIdArr = userIdArr.join(',')
      db.all("
        SELECT d.*, t.name " +"
        FROM Users AS u
        LEFT JOIN UserData AS d
        ON u.id = d.userId
        LEFT JOIN Types AS t
        ON d.typeId = t.id
        WHERE u.id IN (" + userIdArr + ")
      "
      , (err, rows) ->
        if err
          console.log(err);
          return
        resolve(rows)
      )
    )
  setData: (userId, data) ->
    new Promise((resolve) ->
      for row of data
        # console.log row, data[row]
        db.all("
            SELECT * FROM UserData WHERE userId = ? AND typeId = ?
          ",
          userId, Types[row], (err, rows) ->
            if err
              console.log(err);
              return
            if rows.length == 0
              # console.log userId, Types[row], data[row]
              db.run(
                "INSERT INTO UserData (userId, typeId, value) " +
                "VALUES (?, ?, ?)",
                userId, Types[row], data[row],
                () ->
                  #console.log '2r3r'
              )
            else
              db.run(
                "UPDATE UserData " +
                "SET value = ? " +
                "WHERE userId = ? AND typeId = ?",
                data[row], userId, Types[row],
                () ->
                  #console.log 'sdd'
              )
            resolve(rows)
        )
    )
  create: (nickname, password) ->
    new Promise((resolve) ->
      keys = Crypto.getKeys()
      db.run(
        "INSERT INTO Users (nickname, password, public, nodeId, isLocal) " +
        "VALUES (?, ?, ?, ?, ?)",
        nickname, sha256(password), keys.public, 0, 1
      )
      db.get("SELECT * FROM Users WHERE id = last_insert_rowid()", (err, user) ->
        db.run(
          "INSERT INTO UserData (userId, typeId, value) " +
          "VALUES (?, ?, ?)",
          user.id, Types.private, keys.private
        )
        resolve(user)
      )
    )