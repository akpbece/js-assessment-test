var args = require('yargs').argv;
var config = require('../gulp.config')();
var wire = require('wiredep');
var plugins = require('gulp-load-plugins')({lazy: true});
var log = require('../gulp-utils/log.js');
var path = require('path');

module.exports = startTests;

/**
 * Start the tests using karma.
 * filesToTest - Array of files to be tested
 * variant - name of the variant
 */
function startTests(filesToTest, variant, done) {
	var child;
	var karma = require('karma').server;
	var testScriptDependencies = wire({devDependencies: true})['js'];

	karma.start({
		configFile: path.resolve('karma.conf.js'),
		files: [].concat(testScriptDependencies, filesToTest),
		exclude: [
			config.variant.directory + (!variant) + '/**/*.js'
		],
		singleRun: !args.watch,
		coverageReporter: {
			check: {
				global: {
					statements: config.test.coverage.statements,
					branches: config.test.coverage.branches,
					functions: config.test.coverage.functions,
					lines: config.test.coverage.lines
				}
			},
			dir: './report/coverage/' + variant,
			reporters: [
				// reporters not supporting the `file` property
				{type: 'html', subdir: 'report-html'},
				{type: 'text-summary'} //, subdir: '.', file: 'text-summary.txt'}
			]
		}
	}, karmaCompleted);

	////////////////

	function karmaCompleted(karmaResult) {
		log('Karma completed testing -- ' + variant);

		/**
		 * karmaResult is equal to 1 if there is an error
		 * and 0 if there is no unit test error
		 */
		if (karmaResult === 1) {
			plugins.util.beep();
			throw new Error('Unit Test Error...');
		}

		if (child) {
			log('shutting down the child process');
			child.kill();
		} else {
			if (typeof done === 'function') {
				done();
			}
		}
	}
}
