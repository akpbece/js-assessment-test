
/**
 * When files change, log it
 * @param  {Object} event - event that fired
 */

'use strict';

var config = require('../gulp.config')();
var log = require('../gulp-utils/log.js');

module.exports = changeEvent;

function changeEvent(event) {
	var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
	log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

