'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

var config = require('./config.json');
var assetConfig = config['assets'];

var html = assetConfig['html'];
var js = assetConfig['js'];
var css = assetConfig['css'];

gulp.task('default', ['compile', 'test']);
gulp.task('compile', ['html', 'js', 'css']);

gulp.task('watch', ['watch:js', 'watch:css', 'watch:html']);

gulp.task('watch:js', function() {
  gulp.watch(js['src']['glob'], ['js','test']);
});

gulp.task('watch:css', function() {
  gulp.watch(css['src']['glob'], ['css']);
});

gulp.task('watch:html', function() {
  gulp.watch(html['src']['glob'], ['html']);
});

gulp.task('test', ['js'], function(done) {
  var karma = require('karma');

  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

function generateHtmlTask(asset) {
  var ejs = require('gulp-ejs');
  var rename = require('gulp-rename');

  var taskName = "html:" + asset['dest'];

  gulp.task(taskName, function() {
    return gulp.src(asset['src'])
      .pipe(ejs(config))
      .pipe(rename(asset['dest']))
      .pipe(gulp.dest('./package'));
  });

  return taskName;
};
gulp.task('html', html['assets'].map(generateHtmlTask));

function generateJsTask(asset) {
  var uglify = require('gulp-uglify');
  var sourcemaps = require('gulp-sourcemaps');

  var taskName = "js:" + asset['dest'];

  switch(asset['render']) {
    case 'concat':
      gulp.task(taskName, ['js:lint'], function() {
        var concat = require('gulp-concat');

        return gulp.src(asset['glob'])
          .pipe(sourcemaps.init())
          .pipe(concat(asset['dest']))
          .pipe(uglify())
          .pipe(sourcemaps.write('maps'))
          .pipe(gulp.dest('./package/js'));
      });
      break;
    case 'ejs':
      gulp.task(taskName, ['js:lint'], function() {
        return gulp.src(asset['src'])
          .pipe(sourcemaps.init())
          .pipe(ejs(config))
          .pipe(uglify())
          .pipe(sourcemaps.write('maps'))
          .pipe(gulp.dest('./package/js'));
      });
      break;
    default:
      throw new gutil.PluginError({ plugin: taskName, message: asset['dest'] + " - missing/invalid 'render' property" });
  }

  return taskName;
};
gulp.task('js', js['assets'].map(generateJsTask));

gulp.task('js:lint', function() {
  var jshint = require('gulp-jshint');
  var jshintStylish = require('jshint-stylish');

  return gulp.src(js['src']['glob'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

function generateCssTask(asset) {
  var sass = require('gulp-sass');
  var sourcemaps = require('gulp-sourcemaps');

  var taskName = "css:" + asset['dest'];

  gulp.task(taskName, function() {
    var sassOptions = {
      outputStyle: asset['outputStyle'] || 'compressed'
    };

    return gulp.src(asset['src'])
      .pipe(sourcemaps.init())
      .pipe(sass(sassOptions).on('error', sass.logError))
      .pipe(sourcemaps.write('maps'))
      .pipe(gulp.dest('./package/css'));
  });

  return taskName;
}
gulp.task('css', css['assets'].map(generateCssTask));
