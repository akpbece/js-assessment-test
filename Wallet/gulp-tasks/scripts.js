'use strict';

var args = require('yargs').argv;
var readSubDirectories = require('../gulp-utils/read-sub-directories.js');
var getVariantGlob = require('../gulp-utils/get-variant-glob.js');
var getFileHeader = require('../gulp-utils/get-file-header.js');
var config = require('../gulp.config')();
var plugins = require('gulp-load-plugins')({lazy: true});
/* jshint -W079 */
var _ = require('lodash');

module.exports = buildJS;

function buildJS(gulp) {
	return function(done) {
		var variants = readSubDirectories(config.variant.directory);
		var defaultModules = readSubDirectories(config.variant.directory +
			config.variant.default +
			'/modules');

		// Build Config options
		var isOptimize = args.optimize ? args.optimize : false;
		var dest = args.dest ? args.dest : config.temp.app;

		_.each(variants, function(currentVariant) {
			var variantModules = readSubDirectories(config.variant.directory + currentVariant + '/modules');
			var allModules = _.union(defaultModules, variantModules);

			getVariantGlob(currentVariant, 'js').then(function(variantGlob) {

				// inject the variant modules to the app.modules.js file
				gulp.src(config.variant.modulesFile)
					.pipe(plugins.replace('inject_modules', allModules))

					// add the regular src files
					.pipe(plugins.addSrc(config.js.app))

					// add the variants
					.pipe(plugins.addSrc(variantGlob))

					// order the files according to our config
					.pipe(plugins.order(config.js.order))
					.pipe(plugins.if(args.verbose, plugins.print(function(filepath) {
						return currentVariant + ': ' + filepath;
					})))

					// this puts the version header, but ugilify will strip out all but first one
					.pipe(getFileHeader())

					.pipe(plugins.if(!isOptimize, plugins.sourcemaps.init()))
					.pipe(plugins.concat(currentVariant + '.variant.js'))
					.pipe(plugins.if(isOptimize, plugins.ngAnnotate({add: true})))
					.pipe(plugins.if(isOptimize, plugins.uglify(config.uglify)))

					// put .map sourcemap files in same directory
					.pipe(plugins.if(!isOptimize, plugins.sourcemaps.write('.')))
					.pipe(gulp.dest(dest + 'variants/'));

			});
		});

		done();

	};
}
