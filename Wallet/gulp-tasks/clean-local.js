/**
 * Remove all files under tmp folder
 * return {Stream}
 */

'use strict';

var config = require('../gulp.config')();
var del = require('del');

module.exports = cleanLocal;

function cleanLocal () {
	return function(done) {
		del(config.temp.root, done);
	};
}
