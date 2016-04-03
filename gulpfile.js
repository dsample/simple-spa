'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var karma = require('karma');
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');

var sassFilesGlob = 'src/sass/**/*.scss';
var jsFilesGlob = 'src/js/**/*.js';

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

gulp.task('html', function() {
  console.log('html');
});

gulp.task('js', ['js:lint'], function() {
  gulp.src(jsFilesGlob)
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
