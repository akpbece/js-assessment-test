'use strict';

var fs = require('fs');
var path = require('path');

module.exports = readFilesFromDirectory;

/**
 * @Gulp-Utilities
 * @param {String} srcpath - glob of directory to read
 *
 * @return {Array} list of immediate child directories as strings of the src directory
 * */
function readFilesFromDirectory(srcpath) {
	return fs.readdirSync(srcpath).filter(function(file) {
		return !fs.statSync(path.join(srcpath, file)).isDirectory();
	});
}
