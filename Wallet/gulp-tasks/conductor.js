'use strict';
var args = require('yargs').argv;
var config = require('../gulp.config.js')();
var envConfigHelper = require('../gulp-utils/env-config-helper.js'); // todo

var plugins = require('gulp-load-plugins')({lazy: true});

module.exports = conductor;

/**
 * Set the canary url path for app.conductor and replace them with the
 * correct url based on some configuration, hard-coded for now.
 * @return {Stream}
 */
function conductor(gulp) {
	return function() {

		// Set Defaults
		var conductorJS = config.client + 'app/app.conductor.js';
		var dest = args.dest ? args.dest : config.temp.app;
		args.env = args.env || 'local';

		// Set Injected Urls
		var configFile = envConfigHelper(args.env);
		var serviceUrl = configFile.service.url;
		var bundleUrl = configFile.bundle.url;

		return gulp
			.src(conductorJS)
			.pipe(plugins.replace('{SERVICE-URL}', serviceUrl))
			.pipe(plugins.replace('{BUNDLE-URL}', bundleUrl))
			.pipe(plugins.concat('app.js'))
			.pipe(gulp.dest(dest + 'js'));
	};
}
