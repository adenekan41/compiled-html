const gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	jsImport = require('gulp-js-import'),
	sass = require('gulp-sass'),
	fileinclude = require('gulp-file-include'),
	cleanCSS = require('gulp-clean-css'),
	access = require('gulp-accessibility'),
	gutil = require('gulp-util'),
	connect = require('gulp-connect');

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
 * watchs for file changes
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
 * Generate a minified files for every of our assests
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
 * allows files including in our HTML ( component templating )
 * @param []
 * @function [fileinclude]
 * @argument ()
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

/**
 * starts the server on :3200
 * @param []
 * @function [connect]
 */
gulp.task('connect', async () => {
	await connect.server({
		root: 'dist',
		port: 3200,
		host: 'localhost',
		livereload: true,
	});
});

/**
 * Runs all the HTML file on an accessbility module
 * @param []
 * @function [test]
 */
gulp.task('test', async function() {
	await gulp
		.src(['src/*.html', 'src/components/**/*.html'])
		.pipe(
			access({
				force: true,
			})
		)
		.on('error', console.log)
		.pipe(connect.reload());
});
/**
 * Enables JS importing in our files
 * @param []
 * @function [js]
 */
gulp.task('js', async function() {
	await gulp
		.src('src/scripts/*.js')
		.pipe(
			jsImport({
				hideConsole: true,
				importStack: true,
			})
		)
		.pipe(uglify())
		.pipe(gulp.dest('dist/scripts'))
		.pipe(connect.reload());
});
//start tasks at once
gulp.task(
	'default',
	gulp.parallel(
		'log',
		'html',
		'js',
		'fileinclude',
		'assets',
		'sass',
		'test',
		'connect',
		'watch'
	)
);
