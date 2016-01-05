import gulp from 'gulp'
import babel from 'gulp-babel'
import eslint from 'gulp-eslint'
import sequence from 'gulp-sequence'
import rimraf from 'rimraf'

gulp.task('lint', function () {
  return gulp.src(['**/*.js', '!node_modules/**', '!dist/**'])
    .pipe(eslint())
    .pipe(eslint.format())
})

gulp.task('dist:clean', (cb) => {
  return rimraf('./dist', cb)
})

gulp.task('dist:build', () => {
  return gulp.src('src/**/*.js')
    .pipe(babel({ babelrc: './.babelrc' }))
    .pipe(gulp.dest('dist'))
})

gulp.task('default', sequence(['lint', 'dist:clean'], 'dist:build'))
