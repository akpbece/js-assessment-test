'use strict';

var args = require('yargs').argv;
var runTests = require('../gulp-utils/run-unit-tests.js');
module.exports = tests;

/**
 * Unit Test using karma
 *
 * gulp test or gulp test --variant all
 *    - will run all variant unit test in parallel
 *
 * gulp test --variant <variant name> will only run the test for that specific variant
 *
 * karma will run with watch on by default
 * --once will make it a single run test
 */
function tests() {
	return function() {
		args.watch = args.once ? false : true;
		runTests();
	};
}

