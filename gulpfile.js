var gulp = require('gulp'),
  connect = require('gulp-connect');      // localhost

gulp.task('connect', function(){
	connect.server({
		root: '.',
		port: 9000,
		livereload: false
	});
});

gulp.task('serve', ['connect']);
