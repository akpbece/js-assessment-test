var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);
var args = require('yargs').argv;
var config = require('../gulp.config.js')();

module.exports = buildLocal;

function buildLocal() {
	return function(cb) {

		args.dest = config.temp.app;
		args.optimize = false;

		var parallelTasks = [
			'index',
			'styles',
			'scripts',
			'templates',
			'fonts',
			'images',
			'mocks'
		];

		runSequence('conductor', parallelTasks, cb);
	};
}
