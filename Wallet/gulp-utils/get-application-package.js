'use strict';
var config = require('../gulp.config.js')();
var fs = require('fs');
/* jshint -W079 */
var _ = require('lodash');

module.exports = _.identity(getApplicationPackage);

function getApplicationPackage(keyname) {
	// get a valid application configuration file
	var applicationpackagefile = _.find(config.packages, getFile);
	// parse the complex obj into a simple obj (pojo)
	var applicationpackage = JSON.parse(fs.readFileSync(applicationpackagefile, 'utf8'));
	// return the application property or the whole thing as a simple obj
	return _.isString(keyname) ?
		applicationpackage[keyname] :
		applicationpackage;
}

function getFile(filepath) {
	// get file stream obj
	var stat = fs.statSync(filepath);
	// determine if file is a valid file
	return stat && stat.isFile();
}
