'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var karma = require('karma');
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');
var ejs = require('gulp-ejs');
var rename = require('gulp-rename');

var config = require('./config.json');

var sassFilesGlob = 'src/sass/**/*.scss';
var jsFilesGlob = 'src/js/**/*.js';

var htmlAssets = [
  {
    src: "src/html/index.html.ejs",
    dest: "index.html"
  }
];

gulp.task('default', ['compile', 'test']);
gulp.task('compile', ['html', 'js', 'css']);

gulp.task('watch', ['watch:js', 'watch:css']); 

gulp.task('watch:js', function() {
  gulp.watch(jsFilesGlob, ['test']);
});

gulp.task('watch:css', function() {
  gulp.watch(sassFilesGlob, ['css']);
});

gulp.task('test', ['js'], function(done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

var htmlTasks = [];
htmlAssets.forEach(function(asset) {
  var taskName = "html:" + asset.dest;

  gulp.task(taskName, function() {
    return gulp.src(asset.src)
      .pipe(ejs({
        config: config
      }))
      .pipe(rename(asset.dest))
      .pipe(gulp.dest('./package'));
  });

  htmlTasks.push(taskName);
});

gulp.task('html', htmlTasks);

gulp.task('js', ['js:lint'], function() {
  return gulp.src(jsFilesGlob)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./package/js'));
});

gulp.task('js:lint', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('css', function() {
  var sassOptions = {
    outputStyle: 'compressed'
  };

  return gulp.src(sassFilesGlob)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./package/css'));
});
