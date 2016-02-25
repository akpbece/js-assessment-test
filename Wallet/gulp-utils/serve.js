var args = require('yargs').argv;
var getNodeOptions = require('../gulp-utils/get-node-options.js');
var log = require('../gulp-utils/log.js');
var browserSync = require('browser-sync');
var plugins = require('gulp-load-plugins')({lazy: true});
var startBrowserSync = require('../gulp-utils/start-browser-sync');
var config = require('../gulp.config')();

module.exports = serve;

/**
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {Boolean} isDev - dev or build mode
 * @param  {Boolean} specRunner - server spec runner html
 */
function serve(isDev, specRunner) {
	var debugMode = '--debug';
	var nodeOptions = getNodeOptions(isDev);

	nodeOptions.nodeArgs = [debugMode + '=' + config.nodemonPort];

	if (args.verbose) {
		console.log(nodeOptions);
	}

	return plugins.nodemon(nodeOptions)
		.on('restart', ['vet'], function(ev) {
			log('*** nodemon restarted');
			log('files changed:\n' + ev);
			setTimeout(function() {
				browserSync.notify('reloading now ...');
				browserSync.reload({stream: false});
			}, config.browserReloadDelay);
		})
		.on('start', function() {
			log('*** nodemon started');
			startBrowserSync(isDev, specRunner);
		})
		.on('crash', function() {
			log('*** nodemon crashed: script crashed for some reason');
		})
		.on('exit', function() {
			log('*** nodemon exited cleanly');
		});
}
