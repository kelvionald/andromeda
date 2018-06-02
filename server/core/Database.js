module.exports = function Database(){
  this.init = () => {
    var dbPath = './db.sqlite3'
    var sqlite3 = require('sqlite3').verbose();
    const fs = require('fs');
    var db = new sqlite3.Database(dbPath);
    if (!fs.existsSync(dbPath)) {
      console.log('creating db')
      var text = fs.readFileSync('./dump/struct.sql', 'utf8');
      commands = text.split(';')
      console.log(commands);
      db.serialize(() => {
        for (command of commands){
          if (command)
            db.run(command);
        }
        for (let type in Types){
          db.run(
            "INSERT INTO Types (id, name) " +
            "VALUES (?, ?)",
            Types[type],
            type
          );
        }
      })
    }
    global.db = db
  }
  this.init()
}
module.exports()