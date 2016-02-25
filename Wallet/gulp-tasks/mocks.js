var config = require('../gulp.config.js')();
var args = require('yargs').argv;

module.exports = mocks;

/**
 * @module Gulp Tasks
 * @description Copies over the mock folder to the folder being
 * served or built, we then reference the full tile paths in the app
 * TODO - This is temp until we have a full mocking solution.
 * */
function mocks(gulp) {
	return function() {
		var dest = args.dest ? args.dest : config.temp.app;

		return gulp
			.src(config.mocks)
			.pipe(gulp.dest(dest + 'mocks'));
	};
}
