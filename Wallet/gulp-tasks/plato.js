'use strict';

var args = require('yargs').argv;
var config = require('../gulp.config')();
var log = require('../gulp-utils/log.js');
var glob = require('glob');
var openUrl = require('open');

module.exports = plato;

/**
 * Start Plato inspector and visualizer
 * args: --open
 *    passing open will open the report in a browser for you
 *    this is turned off for CI by default.
 */
function startPlatoVisualizer(done) {
	log('Running Plato');

	var files = glob.sync(config.plato.js);
	var excludeFiles = /.*\.spec\.js/;
	var plato = require('plato');

	var options = {
		title: 'Plato Inspections Report',
		exclude: excludeFiles
	};
	var outputDir = config.root + '/report/plato';

	plato.inspect(files, outputDir, options, platoCompleted);

	function platoCompleted(report) {
		var overview = plato.getOverviewReport(report);
		if (args.verbose) {
			log(overview.summary);
		}
		if (done) {
			done();
		}
		if (args.open) {
			openUrl('./report/plato/index.html');
		}
	}
}

/**
 * @module gulp-tasks/plato
 *
 * @description Create a visualizer report
 */

function plato() {
	return function(done) {
		log('Analyzing source with Plato');
		log('Browse to /report/plato/index.html to see Plato results');

		startPlatoVisualizer(done);
	};
}
