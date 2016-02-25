'use strict';
var getApplicationPackage = require('../gulp-utils/get-application-package');
var log = require('../gulp-utils/log.js');
var fs = require('fs');

module.exports = createApplicationVersionFile;

function createApplicationVersionFile(/*gulp*/) {
	// error callback
	function onerror(err) {
		if (err) {
			return log([
				'error -- createApplicationVersionFile:',
				err
			]);
		}
	}
	return function() {
		// get the uncached version string
		var version = getApplicationPackage('version');
		// write to a file in the root of the repository
		// a 'VERSION.txt' file containing only the version string
		fs.writeFile('VERSION.txt', version, onerror);
	};
}
