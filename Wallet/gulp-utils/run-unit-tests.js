var args = require('yargs').argv;
var plugins = require('gulp-load-plugins')({lazy: true});
var startTests = require('../gulp-utils/start-unit-tests.js');
var readSubDirectories = require('../gulp-utils/read-sub-directories.js');
var config = require('../gulp.config')();
var colors = plugins.util.colors;
/* jshint -W079 */
var _ = require('lodash');

module.exports = runUnitTests;

function runUnitTests() {
	var variantArgument = args.variant;
	var isTestAllVariants = !variantArgument || variantArgument === 'all';
	var variantDir = config.variant.directory;
	var variants = readSubDirectories(variantDir);
	var unitTestErrorMessage = 'Unit Test Error: You supplied type as ';

	var variantGlob;

	// Angular needs modules to be loaded first before the rest of scripts
	var coreFilesAndSpecs = [
		config.client + 'app/app.module.js',
		config.client + 'app/core/**/*.module.js',
		config.client + 'app/core/**/*.js'
	];

	// Test all variants in parallel
	if (isTestAllVariants) {
		variants.forEach(testVariants);
		// Test one variant at a time depending on what type of variant you pass in
	} else if (_.contains(variants, variantArgument)) {
		testVariants(variantArgument);
	} else {
		// Throw an error if variant doesn't exist in the variant array
		plugins.util.beep();
		throw new Error(colors.bgRed(unitTestErrorMessage + variantArgument));
	}

	function testVariants(variant) {
		var variantTemplateCache = config.temp.app + 'templates/' + variant + '.templates.js';

		// Angular needs modules to be loaded first before the rest of scripts
		variantGlob = [
			variantDir + variant + '/**/*.module.js',
			variantDir + variant + '/**/*.js'
		];

		// Concat all core files and specs, variant and variant template cache
		startTests(coreFilesAndSpecs.concat(variantGlob, variantTemplateCache), variant);
	}
}
