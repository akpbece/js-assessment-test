'use strict';

//var path = require('path');
var readSubDirectories = require('../gulp-utils/read-sub-directories.js');
var getFileHeader = require('../gulp-utils/get-file-header.js');
var plugins = require('gulp-load-plugins')({lazy: true});
var config = require('../gulp.config')();
var glob = require('glob');
var args = require('yargs').argv;
/* jshint -W079 */
var _ = require('lodash');

module.exports = styles;

/**
 * test if filename matches with the module name
 * @param {String} [file] [the name of the sass/scss file]
 * @return {Boolean} [TF based on expression check]
 */
function hasSameNameAsModule (file) {
	// only leave scss files that have the same name as the module
	return /\/(.*)\/\1\.scss$/.test(file);
}

/**
 * get list of variants with their own styles
 * @param {Object} [config] [the configuration for the gulp task]
 * @return {Array} [list of variant namespaces with their own style]
 */
function getListOfVariantsWithTheirOwnStyle (config) {
	// figure out which variants have their own styles
	// so we dont have to depend on calling fs.stat per variant as it could be slow
	var foundItems = glob.sync('*/styles/style.scss', {
		'cwd': config.variant.directory
	});
	// map names
	return _.map(foundItems, function doMapOfNames(item) {
		var strippedName = /^[^\/]+/.exec(item);
		return strippedName[0];
	});
}

/**
 * get list of modules with their own styles and the scss file with the matching name
 * @param {Object} [config] [the configuration for the gulp task]
 * @param {String} [variant] [optional ** the variant file name]
 * @return {Array} [list of filtered module style files]
 */
function getListOfModuleStyles (config, variant) {
	var cwd = config.variant.directory + (variant || config.variant.default);
	// get found list of modules with styles
	var foundItems = glob.sync('modules/**/*.scss', {
		'cwd': cwd
	});
	// get filtered list of default styles matching the madule name
	return _.filter(foundItems, hasSameNameAsModule);
}

/**
 * get a generated routine that is configured from a series of arguments for the sass plugin to run
 * @param {Object} [config] [the configuration for the gulp task]
 * @param {String} [variant] [the variant file name]
 * @param {Array} [listOfVariantsWithTheirOwnStyle] [list of variants with their own style file]
 * @return {Function} [routine for the sass gulp plugin 'importer' option]
 */
function createSassImporterRoutine (config, variant, listOfVariantsWithTheirOwnStyle) {
	// other styles files this variant may want to override (inside of the styles directory)
	var otherSrcFiles = glob.sync('**/!(style).scss', {
		'cwd': config.variant.directory + variant + '/styles'
	});

	return function sassImporterRoutine(file, prev, done) {
		// this variant doesnt have its own styles file but
		// it has its own version of an imported styles file
		// lets tell SASS to use that instead of the default
		if (
			!_(listOfVariantsWithTheirOwnStyle).contains(variant) &&
			_(otherSrcFiles).contains(file)
		) {
			done({
				'file': '../../' + variant + '/styles/' + file
			});
		} else {
			// let SASS handle the file internally
			done(null);
		}
	};
}

/**
 * creates a function that determines a path based on the variant configuration
 * @param {Object} [config] [the configuration for the gulp task]
 * @param {String} [variant] [optional ** the variant file name]
 * @return {Function} [routine of mapped file paths changes to absolute paths]
 */
function createMapRoutine (config, variant) {
	var cwd = config.variant.directory + (variant || config.variant.default);
	return function mapListOfFilePaths(item) {
		return cwd + '/' + item;
	};
}

function styles (gulp) {
	return function doStyles (done) {
		var isOptimize = !!args.optimize;
		var dest = args.dest ? args.dest : config.temp.app;

		// list of initial variants
		var variants = readSubDirectories(config.variant.directory);

		// list of default Module Styles
		var defaultModuleStyles = getListOfModuleStyles(config);

		// figure out which variants have their own styles
		var listOfVariantsWithTheirOwnStyle = getListOfVariantsWithTheirOwnStyle(config);

		if (args.verbose) {
			// console.log('CONFIG: %j' , config );
			console.log('Initial Variants: %j', variants);
			console.log('Default Module Styles: %j', defaultModuleStyles);
			console.log('Variants with their own style: %j', listOfVariantsWithTheirOwnStyle);
		}

		// do gulp processes for each variant
		_.each(variants, doIterateOverVariants);

		// trigger async done
		done();

		function doIterateOverVariants (variant) {
			// relative path from the current variant, to the default one
			//path.relative(config.variant.directory + variant, config.variant.directory + config.variant.default);

			// use the default styles unless this variant has its own
			var srcFile = _(listOfVariantsWithTheirOwnStyle).contains(variant) ?
				config.variant.directory + variant + '/styles/style.scss' :
				config.variant.directory + config.variant.default + '/styles/style.scss';

			var variantModStyles = getListOfModuleStyles(config, variant);

			// change the variantModStyles to absolute path also
			var variantModStylesWithAbsolutePaths = variantModStyles.map(createMapRoutine(config, variant));

			// get the styles in default that are not overridden, and change it to absolute path
			var injectableStyles = _.difference(defaultModuleStyles, variantModStyles)
				.map(createMapRoutine(config))
				// concat the list of default module styles, with the list of variant module styles (absolute path)
				.concat(variantModStylesWithAbsolutePaths);

			// mutate for gulp purposes
			injectableStyles = gulp.src(injectableStyles, {read: false})
				.pipe(plugins.if(args.verbose, plugins.print()));

			gulp.src(srcFile)
				.pipe(plugins.plumber())
				.pipe(plugins.if(!isOptimize, plugins.sourcemaps.init()))
				.pipe(plugins.inject(injectableStyles, {relative: true}))
				.pipe(plugins.sass({
					// list recognized as a resolved path for @import declarations
					'includePaths': config.sassIncludePaths,
					// This is an experimental Libsass feature. Use with caution.
					'importer': createSassImporterRoutine(config, variant, listOfVariantsWithTheirOwnStyle)
				}))
				.pipe(plugins.concat(variant + '.style.css'))
				.pipe(plugins.autoprefixer(config.autoprefixer))
				.pipe(getFileHeader())
				.pipe(plugins.if(isOptimize, plugins.cssnano()))
				// put .map sourcemap files in same directory
				.pipe(plugins.if(!isOptimize, plugins.sourcemaps.write('.')))
				.pipe(gulp.dest(dest + 'styles/'));
		}
	};
}
