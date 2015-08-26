import gulp from 'gulp';
import babel from 'gulp-babel';
import sequence from 'gulp-sequence';
import rimraf from 'rimraf';

gulp.task('dist:clean', (cb) => {
  return rimraf('./dist', cb);
});

gulp.task('dist:build', () => {
  return gulp.src('src/**/*.js')
    .pipe(babel({ babelrc: './.babelrc' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', sequence('dist:clean', 'dist:build'));
