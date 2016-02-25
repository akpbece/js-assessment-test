'use strict';

var args = require('yargs').argv;

var config = require('../gulp.config')();
var log = require('../gulp-utils/log.js');

var plugins = require('gulp-load-plugins')({lazy: true});

/**
 * Compress images
 * @return {Stream}
 */

// TODO clean before moving images again

module.exports = images;

function images(gulp) {
	return function() {
		var imageDestination = args.dest;

		log('Compressing and copying images');

		gulp
			.src(config.images)
			.pipe(plugins.imagemin({optimizationLevel: 4}))
			.pipe(gulp.dest(imageDestination + 'images/'));
	};
}
