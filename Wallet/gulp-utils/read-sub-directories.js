'use strict';

var fs = require('fs');
var path = require('path');

module.exports = readSubDirectories;

/**
 * @Gulp-Utilities
 * @param {String} srcpath - glob of directory to read
 * @param {String} ignore - glob of path to ignore
 *
 * @return {Array} list of immediate child directories as strings of the src directory
 * */
function readSubDirectories(srcpath, ignore) {
	if (ignore && typeof ignore === 'string') {
		ignore = [ignore];
	}

	return fs.readdirSync(srcpath).filter(function(file) {
		var skip = false;

		// do we need to skip this file
		if (ignore && ignore.indexOf(file) !== -1) {
			skip = true;
		}

		return !skip && fs.statSync(path.join(srcpath, file)).isDirectory();

	});
}
