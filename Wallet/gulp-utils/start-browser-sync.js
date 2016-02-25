'use strict';
var args = require('yargs').argv;
var log = require('../gulp-utils/log.js');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var changeEvent = require('../gulp-utils/change-event.js');
var config = require('../gulp.config')();
var port = process.env.PORT || config.defaultPort;
var fs = require('fs');
var applicationpackage = JSON.parse(fs.readFileSync('./package.json'));

module.exports = startBrowserSync;

/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 * --nosyncopen will stop the browser from automatically opening
 * --nosyncnotify will stop the browser displaying browserSync notifications
 */
function startBrowserSync(isDev, specRunner) {
	if (args.nosync || browserSync.active) {
		return;
	}

	log('Starting BrowserSync on port ' + port);

	gulp.watch(config.js.watch, ['scripts', browserSync.reload])
		.on('change', changeEvent);
	gulp.watch(config.html.index, ['index', browserSync.reload])
		.on('change', changeEvent);
	gulp.watch(config.styles.all, ['styles'])
		.on('change', changeEvent);
	gulp.watch(config.html.all, ['templates'], browserSync.reload)
		.on('change', changeEvent);

	var options = {
		proxy: 'localhost:' + port,
		port: config.browserSyncPort,
		files: isDev ? [
			config.temp.app + '**/*'
		] : [
			config.build.app + '**/*'
		],
		ghostMode: { // these are the defaults t,f,t,t
			clicks: true,
			location: false,
			forms: true,
			scroll: true
		},
		startPath: (isDev ? config.temp.dir : config.build.dir) + config.browserSyncStartPath,
		injectChanges: true,
		logFileChanges: true,
		logLevel: 'debug',
		logPrefix: applicationpackage.name || 'gulp-patterns',
		// The small pop-over notifications in the browser are not always needed/wanted.
		notify: !args.nosyncnotify,
		// Stop the browser from automatically opening
		open: !args.nosyncopen,
		browser: args.syncbrowser || 'default',
		reloadDelay: 0 //1000
	};
	if (specRunner) {
		options.startPath = config.specRunnerFile;
	}

	browserSync(options);
}
