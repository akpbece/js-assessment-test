'use strict';

var config = require('../gulp.config')();
var glob = require('glob');

module.exports = getVariantGlob;

/* globals Promise */
function getVariantGlob(variantName, fileExtension) {
	var defaults = config.variant.directory + config.variant.default + '/';

	if (!fileExtension) {
		fileExtension = '**/*.js';
	} else {
		fileExtension = '**/*.' + fileExtension;
	}

	// Return the default glob for default
	if (variantName === config.variant.default) {
		var defaultGlob = [defaults + fileExtension];

		// ignore the spec files for JS
		if (/\.js$/.test(fileExtension)) {
			defaultGlob.push('!**/*.spec.js');
		}

		return Promise.resolve(defaultGlob);
	}

	var variantPath = config.variant.directory + variantName + '/';

	return new Promise(getFilesToOverride).then(createGlob);

	/////////////////

	function getFilesToOverride(resolve, reject) {
		glob(variantPath + fileExtension, manipulateFileList);

		function manipulateFileList(err, list) {
			if (err) {
				return reject(err);
			}
			var newList = list.map(manipulator);

			// remove the spec files for JS
			if (/\.js$/.test(fileExtension)) {
				newList = newList.filter(filterSpecs);
			}

			return resolve(newList);
		}

		function manipulator(item) {
			return item.replace(variantPath, '!' + defaults);
		}

		function filterSpecs(item) {
			return !(/\.spec\.js$/.test(item));
		}
	}

	function createGlob(overrides) {
		var finalGlob = overrides;
		// prepend the list of files we want to include to the list of the overrides
		finalGlob.unshift(defaults + fileExtension, variantPath + fileExtension);

		// ignore the spec files for JS
		if (/\.js$/.test(fileExtension)) {
			finalGlob.push('!**/*.spec.js');
		}

		return finalGlob;
	}
}
