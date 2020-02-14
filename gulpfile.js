const gulp = require('gulp'),
	uglify = require('gulp-uglify-es').default,
	imagemin = require('gulp-imagemin'),
	jsImport = require('gulp-js-import'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	fileinclude = require('gulp-file-include'),
	cleanCSS = require('gulp-clean-css'),
	beautify = require('gulp-beautify'),
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
		.on('error', function(err) {
			gutil.log(gutil.colors.red('[Error]'), err.toString());
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
		.on('error', function(err) {
			gutil.log(gutil.colors.red('[Error]'), err.toString());
		})
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
	await gulp.watch('src/scripts/**/*.js', gulp.series('js-compile'));
	await gulp.watch('src/styles/**/*.scss', gulp.series('sass'));
	await gulp.watch(
		[
			'src/*.html',
			'src/*.cw',
			'src/components/**/*.html',
			'src/components/**/*.cw',
		],
		gulp.parallel('html-compile', 'test')
	);
	await gulp.watch('src/assets/*', gulp.parallel('assets'));
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
		.on('error', function(err) {
			gutil.log(gutil.colors.red('[Error]'), err.toString());
		})
		.pipe(gulp.dest('dist/assets'))
		.pipe(connect.reload());
});

/**
 * allows files including in our HTML ( component templating )
 * @param []
 * @function [fileinclude]
 * @argument ()
 */
gulp.task('html-compile', async () => {
	await gulp
		.src(['src/*.html', 'src/*.cw'])
		.pipe(
			rename(function(path) {
				// Returns a completely new object, make sure you return all keys needed!
				return {
					dirname: path.dirname,
					basename: path.basename,
					extname: '.html',
				};
			})
		)
		.pipe(
			fileinclude({
				prefix: '@',
				basepath: '@file',
			})
		)
		.pipe(
			beautify.html({
				indent_size: 2,
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
		.src([
			'src/*.html',
			'src/*.cw',
			'src/components/**/*.html',
			'src/components/**/*.cw',
		])
		.pipe(
			access({
				force: true,
			})
		)
		.on('error', function(err) {
			gutil.log(gutil.colors.red('[Error]'), err.toString());
		})
		.on('error', console.log)
		.pipe(connect.reload());
});
/**
 * Enables JS importing in our files
 * @param []
 * @function [js]
 */
gulp.task('js-compile', async function() {
	await gulp
		.src('src/scripts/*.js')
		.pipe(
			jsImport({
				hideConsole: true,
				importStack: true,
			})
		)
		.pipe(uglify())
		.on('error', function(err) {
			gutil.log(gutil.colors.red('[Error]'), err.toString());
		})
		.pipe(gulp.dest('dist/scripts'))
		.pipe(connect.reload());
});
//start tasks at once
gulp.task(
	'default',
	gulp.parallel(
		'log',
		'html-compile',
		'js-compile',
		'assets',
		'sass',
		'test',
		'connect',
		'watch'
	)
);
