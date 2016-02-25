/**
 * @exports Protractor_Configuration
 *
 * @description This is the configuration for protractor, End to End (e2e test)
 *
 * @see package.json's script's object for list of commands on how to run e2e
 * for specific variant
 *
 * @example
 *     npm run e2e:test:default - will run end to end test for default variant
 *     npm run e2e:test:newPaymentCard - will run e2e test for newPaymentCard
 */

var R = require('ramda');

var args = require('yargs').argv;
var gutil = require('gulp-util');

var getDirName = require('./gulp-utils/read-sub-directories.js');
var variantDir = './src/client/app/variants/';
var variantArgumentValue = args.variant;

/**
 * Error messages object to be used on logging end to end errors
 * @type {Object}
 */
var errorMessages = {
	variantError: 'Variant Error --- ',
	invalidArgument: 'Invalid argument: ',
	noVariantArg: 'No variant argument'
};

/**
 * @description Will throw an error when specific condition are not met
 * @param  {String} errorMessage Message to be logged
 */
var throwError = function(errorMessage) {
	gutil.beep();
	throw new Error(gutil.colors.bgRed('End to End test error --- ' + errorMessage));
};

/**
 * Uses node file system module to return the sub-directory names of a folder
 * @return {Array} An array of subfolder names
 * @see gulp/get-directory-name
 */
var readVariantDirectories = function() {
	return getDirName(variantDir);
};

/**
 * This block will identify if there is a variant argument.
 * If it doesn't, it will throw an error
 * @param  {String}  variantArgumentValue variant argument value
 * @return {String}
 */
var hasVariantArgument = function(variantArgumentValue) {
	return !!variantArgumentValue ?
		variantArgumentValue : throwError(errorMessages.noVariantArg);
};

/**
 * This will check if variant argument value exist in the variant array list.
 * If it doesn't, it will throw an error.
 * @param  {String}  variantName variant name
 * @return {String}
 */
var isValidVariant = function(variantName) {
	return (function() {
		var variantDir = readVariantDirectories();
		return R.contains(variantName, variantDir) ?
			variantName : throwError(errorMessages.invalidArgument + variantName);
	}());
};

/**
 * Will build the glob to fetch the e2e specs
 * @param  {String} variantName
 * @return {String} e2e path
 */
var buildVariantPaths = function(variantName) {
	return './e2e/' + variantName + '/**/**/*.spec.js';
};

var verifyVariantArgument = R.compose(isValidVariant, hasVariantArgument);

var getE2EPath = R.compose(buildVariantPaths, verifyVariantArgument);

var suitesPath = getE2EPath(variantArgumentValue);

exports.config = {
	// Capabilities to be passed to the webdriver instance.
	capabilities: {
		'browserName': 'chrome'
	},
	// Spec patterns are relative to the current working directly when
	// protractor is called.
	suites: [suitesPath],
	//
	// Possible option
	// jasmine, jasmine2 and mocha - common and recommended
	//
	framework: 'mocha',

	mochaOpts: {
		ui: 'bdd',
		timeout: 5000
	},

	/**
	 * Set the base url to where we would perform the end to end test so that
	 * if we need to test on different environment, we only have to change this
	 * on one place
	 */
	baseUrl: 'http://localhost:3000'
};
