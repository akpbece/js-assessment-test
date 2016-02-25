/**
 * Copy fonts
 * @return {Stream}
 */

'use strict';
var args = require('yargs').argv;
var config = require('../gulp.config')();
var log = require('../gulp-utils/log.js');

module.exports = fonts;

// TODO : clean before moving fonts again.
function fonts(gulp) {
	return function() {
		var fontDestination = args.dest;
		log('Copying fonts');

		return gulp
			.src(config.fonts)
			.pipe(gulp.dest(fontDestination + 'fonts'));
	};
}
