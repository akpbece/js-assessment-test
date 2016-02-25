/**
 * Remove all files under build folder
 * return {Stream}
 */

'use strict';

var config = require('../gulp.config')();
var del = require('del');

module.exports = cleanBuild;

function cleanBuild () {
	return function(done) {
		del(config.build.root, done);
	};
}
