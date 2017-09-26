var gulp = require('gulp')
var gulpif = require('gulp-if')
var clean = require('gulp-clean')
var sass = require('gulp-sass')
var minifycss = require('gulp-minify-css')
var uglify = require('gulp-uglify')
var standard = require('gulp-standard')
var zip = require('gulp-zip')
var browserify = require('gulp-browserify')
var filesToJson = require('gulp-files-to-json')
var paths = require('./paths')
var production = true

gulp.task('dev', function () {
  production = false
})

gulp.task('clean', function () {
  return gulp.src('build/*', { read: false })
    .pipe(clean({ force: true }))
})

gulp.task('copy', function () {
  return gulp.src(paths.staticFiles, { base: 'src' })
    .pipe(gulp.dest('build/'))
})

gulp.task('standard', function () {
  return gulp.src(paths.allScripts)
    .pipe(standard())
    .pipe(standard.reporter('default', { breakOnError: false, quiet: false }))
})

gulp.task('tpls', function () {
  gulp.src('src/tpl/**/*.html')
      .pipe(filesToJson('template.json'))
      .pipe(gulp.dest('src/js/lib/'))
})

gulp.task('scripts', function () {
  gulp.src(paths.scripts)
    .pipe(browserify({ debug: !production }))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest('build/js/'))
})

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(sass())
    .pipe(gulpif(production, minifycss()))
    .pipe(gulp.dest('build/css/'))
})

gulp.task('build', ['tpls', 'scripts', 'styles', 'copy'])

gulp.task('watch', ['dev', 'build'], function () {
  gulp.watch(paths.tpls, ['tpls'])
  gulp.watch(paths.staticFiles, ['copy'])
  gulp.watch(paths.allScripts, ['standard', 'scripts'])
  gulp.watch(paths.allStyles, ['styles'])
})

gulp.task('zip', ['build'], function () {
  var manifest = require('./src/manifest')
  var filename = manifest.name + ' v' + manifest.version + '.zip'

  return gulp.src('build/**/*')
    .pipe(zip(filename))
    .pipe(gulp.dest('dist'))
})

// run all tasks after build directory has been cleaned
gulp.task('default', ['clean', 'build'])
