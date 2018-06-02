var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    coffee = require('gulp-coffee'),
    url = require("url"),
    fs = require("fs")
  
gulp.task('dev', function () {
  function updateHtml() {
    browserSync.reload();
  }

  function updateCoffee() {
    gulp.src('./gui/coffee/*.coffee')
    .pipe(coffee({bare: true})
      .on('error', function (error) {
        console.error("Compilation error: " + error.stack);
        console.log(error.toString())
        this.emit('end')
      })
    )
    .pipe(gulp.dest('./gui/js/'));

    updateHtml();
  }

  updateCoffee();

  // Инициализация сервера
  browserSync.init({
    server: {
      // Установка корневой папки
      baseDir: "./gui",
      middleware: function(req, res, next) {
        var fileName = url.parse(req.url);
        fileName = fileName.href.split(fileName.search).join("");
        console.log('fileName: ' + fileName)
        var fileExists = fs.existsSync('./gui' + fileName);
        if (!fileExists && fileName.indexOf("browser-sync-client") < 0) {
          req.url = "/index.html";
        }
        return next();
      }
    },
    // Установка порта
    port: 9000
  });

  gulp.watch("./gui/*").on('change', updateHtml);
  gulp.watch("./gui/coffee/*").on('change', updateCoffee);
  gulp.watch("./gui/css/*").on('change', updateHtml);

  // mapping
  // var natUpnp = require('nat-upnp');
  // var client = natUpnp.createClient();
  // client.portMapping({
  //   public: 9000,
  //   private: 9000,
  //   ttl: 10
  // }, function(err) {
  //   if (err)
  //     console.log(err)
  //   else{
  //     console.log('complete')
  //   }
  // });
});