'use strict';

var config = require('../gulp.config')();
var sasslintconfig = require('../sasslint.conf');
var plugins = require('gulp-load-plugins')({lazy: true});
var log = require('../gulp-utils/log.js');
var args = require('yargs').argv;

/**
 * @module gulp-tasks/vet-styles
 *
 * @description This gulp task that will run sass-lint.
 */

module.exports = vetStyles;

function vetStyles(gulp) {

	return function() {
		log('Analyzing styles with sass-lint');

		return gulp
			.src(config.styles.vet)
			.pipe(plugins.if(args.verbose, plugins.print()))
			.pipe(plugins.sassLint(sasslintconfig))
			.pipe(plugins.sassLint.format())
			.pipe(plugins.sassLint.failOnError());
	};
}
