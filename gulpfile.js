const gulp = require('gulp');
const connect = require('gulp-connect');
const gutil = require('gulp-util');
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify'),
	concat = require('gulp-concat');

/**
 * Generate a copy file for every html files
 * @param []
 * @function [copy]
 * @argument String
 */

gulp.task('copy', async function () {
	await gulp.src('src/*.html').pipe(gulp.dest('dist'));
});

/**
 * Generate a copy file for every html files
 * @param []
 * @function [log]
 * @argument String
 */

gulp.task('log', async function () {
	await gutil.log('== My Log Task ==');
});

/**
 * Generate a copy file for every html files
 * @param []
 * @function [sass]
 * @argument String
 */
gulp.task('sass', async function () {
	await gulp
		.src('src/styles/*.scss')
		.pipe(
			sass({
				style: 'expanded',
			})
		)
		.on('change', function () {
			gulp.src('dest').pipe(connect.reload());
		})
		.pipe(gulp.dest('dist/css'))
		.pipe(connect.reload());
});

/**
 * Generate a copy file for every html files
 * @param []
 * @function [js]
 * @argument String
 */
gulp.task('js', async function () {
	await gulp
		.src('src/scripts/*.js')
		.pipe(uglify())
		.pipe(concat('script.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(connect.reload());
});

/**
 * Generate a copy file for every html files
 * @param []
 * @function [watch]
 * @argument String
 */
gulp.task('watch', async function () {
	await gulp.watch('src/scripts/*.js', gulp.series('js'));
	await gulp.watch('src/styles/*.scss', gulp.series('sass'));
	await gulp.watch(
		['src/*.html', 'src/components/*.html'],
		gulp.parallel('html', 'fileinclude')
	);
});

/**
 * Generate a copy file for every html files
 * @param []
 * @function [html]
 * @argument String
 */
gulp.task('html', async function () {
	await gulp
		.src('src/*.html')
		.pipe(gulp.dest('dist'))
		.pipe(connect.reload());
});
/**
 * Generate a copy file for every html files
 * @param []
 * @function [html]
 * @argument String
 */
gulp.task('fileinclude', async function () {
	await gulp
		.src(['src/*.html'])
		.pipe(
			fileinclude({
				prefix: '@',
				basepath: '@file',
			})
		)
		.pipe(gulp.dest('dist'))
		.pipe(connect.reload());
});

gulp.task('connect', async function () {
	await connect.server({
		root: 'dist',
		port: 3200,
		host: 'localhost',
		livereload: true,
	});
});

//start tasks at once
gulp.task(
	'default',
	gulp.parallel('connect', 'html', 'js', 'sass', 'fileinclude', 'watch')
);