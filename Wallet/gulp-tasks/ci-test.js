var args = require('yargs').argv;
var runTests = require('../gulp-utils/run-unit-tests.js');

module.exports = testForCI;

/**
 * CI Unit Test using karma
 * Tests all variants and only runs once, fails on error or coverage.
 * Vet also will run as a dependency as outlined in the gulpfile.
 */
function testForCI() {
	return function() {
		args.watch = false;
		runTests();
	};
}
