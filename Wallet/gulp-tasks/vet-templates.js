'use strict';

var config = require('../gulp.config')();
var htmlhintconfig = require('../htmlhint.conf');
var plugins = require('gulp-load-plugins')({lazy: true});
var log = require('../gulp-utils/log.js');
var args = require('yargs').argv;

/**
 * @module gulp-tasks/vet-templates
 *
 * @description This gulp task that will run htmlhint on templates
 */

module.exports = vetTemplates;

function vetTemplates(gulp) {

	return function() {
		log('Analyzing html with htmlhint');

		return gulp
			.src(config.html.vet)
			.pipe(plugins.if(args.verbose, plugins.print()))
			.pipe(plugins.htmlhint(htmlhintconfig))
			.pipe(plugins.htmlhint.reporter())
			.pipe(plugins.htmlhint.failReporter());
	};
}
