'use strict';

var plugins = require('gulp-load-plugins')({lazy: true});
var gulp = require('gulp');

/**
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @returns {Stream} The ordered stream
 */

module.exports = orderSrc;

function orderSrc(src, order) {
	//order = order || ['**/*'];
	return gulp
		.src(src)
		.pipe(plugins.if(order, plugins.order(order)));
}
