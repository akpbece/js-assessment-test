'use strict';

var args = require('yargs').argv;
var config = require('../gulp.config')();
var plugins = require('gulp-load-plugins')({lazy: true});
var log = require('../gulp-utils/log.js');
var colors = plugins.util.colors;

module.exports = vet;

/**
 * @module gulp-tasks/vet
 *
 * @description This gulp task that will run JSHint and JSCS.
 * In addition, this will create a code coverage report that will be
 * stored on the report folder's project root directory
 */

function vet(gulp) {

	log('Analyzing source with JSHint and JSCS');

	return function() {
		return gulp
			.src(config.js.vet)
			.pipe(plugins.if(args.verbose, plugins.print()))
		// vet for jshint rules
			.pipe(plugins.jshint())
			.pipe(plugins.jshint.reporter('jshint-stylish', {verbose: true}))
			.pipe(plugins.jshint.reporter('fail'))
		// get rid of stack trace
			.on('error', function(/* error */) {
				log(colors.red('jshint failure'));
				process.exit(1);
			})
		// vet for jscs rules
			.pipe(plugins.jscs())
			.pipe(plugins.jscs.reporter())
			.pipe(plugins.jscs.reporter('fail'));
	};
}
