var plugins = require('gulp-load-plugins')({lazy: true});
var getApplicationPackage = require('../gulp-utils/get-application-package');

module.exports = getHeader;

// TODO - wire this up when appropriate for tagging versions in each deployed file.

/**
 * Format and return the header for files
 * @return {String}           Formatted file header
 */
function getHeader() {
	var pkg = getApplicationPackage();
	var template = [
		'/*!',
		' * <%= pkg.name %> - <%= pkg.description %>',
		' * @version v<%= pkg.version %>',
		' * @license <%= pkg.license %>',
		' */',
		''
	].join('\n');
	return plugins.header(template, {
		pkg: pkg
	});
}
