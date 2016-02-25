var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);
var args = require('yargs').argv;
var config = require('../gulp.config.js')();
var log = require('../gulp-utils/log.js');

module.exports = build;

/**
 * Build the optimized version
 * and place in the build directory -
 * intended for testing optimized files locally
 * */

function build() {
	return function(cb) {

		///////////////////////////////////////////////////////////////////////////
		// TODO hardcoding mocks for now but after dev cloud we need to remove this
		args.mocks = true;
		///////////////////////////////////////////////////////////////////////////

		args.dest = config.build.app;
		args.optimize = args.optimize || true;
		args.env = args.env || 'local';

		log([
			'ARGS FOR THE BUILD.JS',
			'dest:  ' + args.dest,
			'optimize:  ' + args.optimize,
			'env:  ' + args.env
		]);

		var parallelTasks = [
			'index',
			'styles',
			'scripts',
			'templates',
			'fonts',
			'images'
		];

		if (args.mocks) {
			parallelTasks.push('mocks');
		}

		runSequence('conductor', parallelTasks, cb);
	};
}
