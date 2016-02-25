/* jshint -W117 */
/* jshint -W079 */
'use strict';

/*************************************************************
 *                       Node Modules
 *************************************************************/
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});

/*************************************************************
 *                         Utilities
 *************************************************************/
var utilityDirectory = './gulp-utils/';

var log = require(utilityDirectory + 'log.js');
//var notify = require(utilityDirectory + 'notify.js'); todo
var serve = require(utilityDirectory + 'serve.js');

/*************************************************************
 *                         Gulp Tasks
 *************************************************************/

/**
 * Function to include the gulp task by name from the gulp-task directory
 * @param {String} taskName - name of the task, must match the name of the js file in ./gulp-tasks
 * */
function getTask(taskName) {
	return require('./gulp-tasks/' + taskName + '.js')(gulp);
}

// List the available gulp tasks
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('build', ['clean-build'], getTask('build'));
gulp.task('build-local', ['clean-local'], getTask('build-local'));
gulp.task('bump', getTask('bump'));
gulp.task('clean-build', getTask('clean-build'));
gulp.task('clean-local', getTask('clean-local'));
gulp.task('clean-report', getTask('clean-report'));
gulp.task('clean-sprite', getTask('clean-sprite'));
gulp.task('clean', ['clean-local', 'clean-build', 'clean-report']);
gulp.task('conductor', getTask('conductor'));
gulp.task('create-application-version-file', getTask('create-application-version-file'));
gulp.task('fonts', getTask('fonts'));
gulp.task('images', ['sprite'], getTask('images'));
gulp.task('index', getTask('index'));
gulp.task('scripts', getTask('scripts'));
gulp.task('sprite', ['clean-sprite'], getTask('sprite'));
gulp.task('styles', getTask('styles'));
gulp.task('templates', getTask('templates'));
gulp.task('plato', getTask('plato'));
gulp.task('vet-scripts', getTask('vet-scripts'));
gulp.task('vet-styles', getTask('vet-styles'));
gulp.task('vet-templates', getTask('vet-templates'));
gulp.task('vet', ['vet-scripts', 'vet-styles', 'vet-templates']);
gulp.task('test', ['templates', 'vet', 'clean-report'], getTask('test'));
gulp.task('ci-test', ['templates', 'vet', 'clean-report'], getTask('ci-test'));
gulp.task('serve', ['build-local'], getTask('serve'));
gulp.task('serve-build', ['build'], getTask('serve-build'));

/*************************************************************
 *                      Gulp Build Mocks
 *************************************************************/
gulp.task('mocks', getTask('mocks'));

///////////////////////////////////////////////////////////////

/**
 * yargs variables can be passed in to alter the behavior, when present.
 * Example: gulp build --verbose
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --nosync   : Don't launch the browser with browser-sync when serving code.
 * --debug    : Launch debugger with node-inspector.
 * --debug-brk: Launch debugger and break on 1st line with node-inspector.
 * --startServers: Will start servers for midway tests on the test task.
 */

//gulp.task('build-specs', ['templatecache'], function(done) {
//	log('building the spec runner');
//
//	var wiredep = require('wiredep').stream;
//	var templateCache = config.temp.app + config.templateCache.file;
//	var options = config.getWiredepDefaultOptions();
//	var specs = config.specs;
//
//	if (args.startServers) {
//		specs = [].concat(specs, config.serverIntegrationSpecs);
//	}
//	options.devDependencies = true;
//
//	return gulp
//		.src(config.specRunner)
//		.pipe(wiredep(options))
//		.pipe(inject(config.js, '', config.js.order))
//		.pipe(inject(config.testlibraries, 'testlibraries'))
//		.pipe(inject(config.specHelpers, 'spechelpers'))
//		.pipe(inject(specs, 'specs', ['**/*']))
//		.pipe(inject(templateCache, 'templates'))
//		.pipe(gulp.dest(config.client));
//});

/**
 * Run the spec runner
 * @return {Stream}
 * TODO : determine if we want to make this work again || if we need it
 */
gulp.task('serve-specs', ['build-specs'], function(done) {
	log('run the spec runner');
	serve(true /* isDev */, true /* specRunner */);
	done();
});

//function runNodeInspector() {
//    log('Running node-inspector.');
//    log('Browse to http://localhost:8080/debug?port=5858');
//    var exec = require('child_process').exec;
//    exec('node-inspector');
//}

module.exports = gulp;
