/* jshint -W079 */

var config = require('../gulp.config.js')();
var inject = require('../gulp-utils/inject.js');
var getApplicationPackage = require('../gulp-utils/get-application-package');
var getFileHeader = require('../gulp-utils/get-file-header.js');
var args = require('yargs').argv;
var plugins = require('gulp-load-plugins')({lazy: true});

module.exports = index;

/**
 * TODO add documentation comment here
 * PreTask - Conductor
 *   - This sets moves and sets the urls for conductor in either the .tmp or build directory
 * */

function index(gulp) {
	return function() {
		var wiredep = require('wiredep').stream;
		var options = config.getWiredepDefaultOptions();
		var dest = args.dest ? args.dest : config.temp.app;
		var conductorJS = dest + 'js/app.js';
		var version = getApplicationPackage('version');

		if (args.optimize) {
			var assets = plugins.useref.assets({searchPath: './'});

			// Filters are named for the gulp-useref path
			var cssFilter = plugins.filter('**/*.css');
			var jsAppFilter = plugins.filter('**/' + config.optimized.app);
			var jslibFilter = plugins.filter('**/' + config.optimized.lib);

			// todo - get a env option to inject into app.conductor.js
			// todo - use args.configFile here

			// Conductor is prepared before we run this task so its injected already.
			return gulp
				.src(config.html.index)
				.pipe(plugins.replace('base href="/"', 'base href="/' + config.build.dir + '"'))
				.pipe(plugins.replace('{APPLICATION-VERSION}', version))
				.pipe(wiredep(options))
				.pipe(inject(conductorJS, '', config.js.order))
				.pipe(inject(config.css))
				.pipe(assets) // Gather all assets from the html with useref
				// Get the css
				.pipe(cssFilter)
				.pipe(getFileHeader())
				.pipe(plugins.cssnano())
				.pipe(cssFilter.restore())
				// Get the vendor javascript
				.pipe(jslibFilter)
				.pipe(plugins.uglify(config.uglify)) // another option is to override wiredep to use min files
				.pipe(jslibFilter.restore())
				// app (conductor.js)
				.pipe(jsAppFilter)
				// fixme: this is just a placeholder for injecting app.conductor.js
				.pipe(getFileHeader())
				.pipe(plugins.uglify(config.uglify)) // todo - enable this once we verify conductor.js is working
				.pipe(jsAppFilter.restore())
				.pipe(assets.restore())
				.pipe(plugins.useref())
				.pipe(gulp.dest(dest));
		} else {
			return gulp
				.src(config.html.index)
				.pipe(plugins.replace('base href="/"', 'base href="/' + config.build.dir + '"'))
				.pipe(plugins.replace('{APPLICATION-VERSION}', version))
				.pipe(wiredep(options))
				.pipe(inject(conductorJS, '', config.js.order))
				.pipe(inject(config.css))
				.pipe(gulp.dest(dest));
		}
	};
}
