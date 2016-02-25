'use strict';

var plugins = require('gulp-load-plugins')({lazy: true});
var orderSrc = require('./order-src.js');

/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @returns {Stream}   The stream
 */

module.exports = doInject;

function doInject(src, label, order) {
	var options = {read: false};
	if (label) {
		options.name = 'inject:' + label;
	}

	return plugins.inject(orderSrc(src, order), options);
}
