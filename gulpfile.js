const gulp = require('gulp');
const connect = require('gulp-connect');
const gutil = require('gulp-util');
const access = require('gulp-accessibility');
const cleanCSS = require('gulp-clean-css');
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify'),
	concat = require('gulp-concat');

/**
 * Generate a copy file for every html files
 * @param []
 * @function [copy]
 * @argument String
 */

gulp.task('copy', async () => {
	await gulp.src('src/*.html').pipe(gulp.dest('dist'));
});

/**
 * Generate a copy file for every html files
 * @param []
 * @function [log]
 * @argument String
 */

gulp.task('log', async () => {
	await gutil.log(`== Project Started ==`);
});

/**
 * Generate a copy file for every html files
 * @param []
 * @function [sass]
 * @argument String
 */
gulp.task('sass', async () => {
	await gulp
		.src('src/styles/*.scss')
		.pipe(
			sass({
				style: 'expanded',
			})
		)
		.on('change', () => {
			gulp.src('dest').pipe(connect.reload());
		})
		.pipe(
			cleanCSS(
				{
					compatibility: 'ie8',
					debug: true,
				},
				details => {
					console.log(
						`=== Original Size === ${details.name}: ${details.stats.originalSize} B`
					);
					console.log(
						`=== Minified Size === ${details.name}: ${details.stats.minifiedSize} B`
					);
				}
			)
		)
		.pipe(gulp.dest('dist/styles'))
		.pipe(connect.reload());
});

/**
 * Generate a copy file for every html files
 * @param []
 * @function [js]
 * @argument String
 */
gulp.task('js', async () => {
	await gulp
		.src('src/scripts/*.js')
		.pipe(uglify())
		.pipe(concat('script.js'))
		.pipe(gulp.dest('dist/scripts'))
		.pipe(connect.reload());
});

/**
 * Generate a copy file for every html files
 * @param []
 * @function [watch]
 * @argument String
 */
gulp.task('watch', async () => {
	await gulp.watch('src/scripts/**/*.js', gulp.series('js'));
	await gulp.watch('src/styles/**/*.scss', gulp.series('sass'));
	await gulp.watch(
		['src/*.html', 'src/components/**/*.html'],
		gulp.parallel('html', 'fileinclude', 'test')
	);
	await gulp.watch('src/assets/*', gulp.parallel('assets'));
});

/**
 * Generate a copy file for every html files
 * @param []
 * @function [html]
 * @argument String
 */
gulp.task('html', async () => {
	await gulp
		.src('src/*.html')
		.pipe(gulp.dest('dist'))
		.pipe(connect.reload());
});

/**
 * Generate a copy file for every html files
 * @param []
 * @function [assets]
 * @argument String
 */
gulp.task('assets', async () => {
	await gulp
		.src('src/assets/*')
		.pipe(
			imagemin({
				interlaced: true,
				progressive: true,
				optimizationLevel: 5,
				svgoPlugins: [
					{
						removeViewBox: true,
					},
				],
			})
		)
		.pipe(gulp.dest('dist/assets'))
		.pipe(connect.reload());
});
/**
 * Generate a copy file for every html files
 * @param []
 * @function [html]
 * @argument String
 */
gulp.task('fileinclude', async () => {
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

gulp.task('connect', async () => {
	await connect.server({
		root: 'dist',
		port: 3200,
		host: 'localhost',
		livereload: true,
	});
});

gulp.task('test', function() {
	return gulp
		.src(['src/*.html', 'src/components/**/*.html'])
		.pipe(
			access({
				force: true,
			})
		)
		.on('error', console.log)
		.pipe(connect.reload());
});
//start tasks at once
gulp.task(
	'default',
	gulp.parallel(
		'log',
		'html',
		'fileinclude',
		'js',
		'assets',
		'sass',
		'test',
		'connect',
		'watch'
	)
);
