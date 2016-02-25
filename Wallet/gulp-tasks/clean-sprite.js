'use strict';

var config = require('../gulp.config')();
var del = require('del');
var log = require('../gulp-utils/log.js');

module.exports = cleanBuild;

/**
 * Delete the generated sprite image
 * return {Stream}
 */
function cleanBuild () {
	return function(done) {
		var spriteConfig = config.sprite;

		log('Deleting previous spritesheet');
		del(spriteConfig.imgPath + '/' + spriteConfig.imgName, done);
	};
}
