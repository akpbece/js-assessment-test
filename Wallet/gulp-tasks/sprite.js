'use strict';

var args = require('yargs').argv;
var config = require('../gulp.config.js')();
var spritesmith = require('gulp.spritesmith');
var log = require('../gulp-utils/log.js');
var merge = require('merge-stream');

module.exports = sprite;

/**
 * Generates a single spritesheet of all the images found in /client/images/ using spritesmith
 * return {Stream}
 */
function sprite(gulp) {
	return function() {

		var images = config.images;
		var spriteConfig = config.sprite;
		var imageDest = args.dest + 'images/';
		var cssDest = spriteConfig.cssPath;

		log('Creating new spritesheet');
		var spriteData =  gulp.src(images)
			.pipe(spritesmith(spriteConfig));

		var imgStream = spriteData.img
			.pipe(gulp.dest(imageDest));

		var cssStream = spriteData.css
			.pipe(gulp.dest(cssDest));

		return merge(imgStream, cssStream);
	};
}
