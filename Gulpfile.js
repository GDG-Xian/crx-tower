/**
 * jshint strict:true
 */

var gulp        = require('gulp');
var gulpif      = require('gulp-if');
var watch       = require('gulp-watch');
var clean       = require('gulp-clean');
var sass        = require('gulp-sass');
var minifycss   = require('gulp-minify-css');
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');
var zip         = require('gulp-zip');
var browserify  = require('gulp-browserify');
var filesToJson = require('gulp-files-to-json');
var paths       = require('./paths');
var production  = true;

gulp.task('dev', function() {
  production = false;
});

gulp.task('clean', function() {
  return gulp.src('build/*', { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('copy', function() {
  return gulp.src(paths.staticFiles, { base: 'src' })
    .pipe(gulp.dest('build/'));
});

gulp.task('jshint', function() {
  return gulp.src(paths.allScripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('tpls', function() {
  gulp.src('src/tpl/**/*.html')
      .pipe(filesToJson('template.json'))
      .pipe(gulp.dest('src/js/lib/'));
});

gulp.task('scripts', ['tpls'], function() {
  gulp.src('src/js/*.js')
    .pipe(browserify({ debug: !production }))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(sass())
    .pipe(gulpif(production, minifycss()))
    .pipe(gulp.dest('build/css/'));
});

gulp.task('build', ['tpls', 'scripts', 'styles', 'copy']);

gulp.task('watch', ['dev', 'build'], function() {
  gulp.watch(paths.tpls,        ['tpls']);
  gulp.watch(paths.staticFiles, ['copy']);
  gulp.watch(paths.allScripts,  ['jshint', 'scripts']);
  gulp.watch(paths.allStyles,   ['styles']);
});

gulp.task('zip', ['build'], function() {
  var manifest = require('./src/manifest');
  var filename = manifest.name + ' v' + manifest.version + '.zip';

  return gulp.src('build/**/*')
    .pipe(zip(filename))
    .pipe(gulp.dest('dist'));
});

//run all tasks after build directory has been cleaned
gulp.task('default', ['clean', 'build']);