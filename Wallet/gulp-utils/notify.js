'use strict';
/* jshint -W079 */
var _ = require('lodash');

module.exports = notify;

/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
	var notifier = require('node-notifier');
	var notifyOptions = {
		sound: 'Bottle',
		contentImage: './gulp.png',
		icon: './gulp.png'
	};
	_.assign(notifyOptions, options);
	notifier.notify(notifyOptions);
}
