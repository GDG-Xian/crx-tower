import gulp from 'gulp'
import gulpif from 'gulp-if'
import livereload from 'gulp-livereload'
import args from './lib/args'

gulp.task('pages', () => {
  return gulp.src('app/pages/**/*')
    .pipe(gulp.dest(`dist/${args.vendor}/pages`))
    .pipe(gulpif(args.watch, livereload()))
})
