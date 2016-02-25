'use strict';

var plugins = require('gulp-load-plugins')({lazy: true});

module.exports = function(msg) {
	if (typeof(msg) === 'object') {
		for (var item in msg) {
			if (msg.hasOwnProperty(item)) {
				plugins.util.log(plugins.util.colors.blue(msg[item]));
			}
		}
	} else {
		plugins.util.log(plugins.util.colors.blue(msg));
	}
};
