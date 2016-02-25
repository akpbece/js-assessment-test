'use strict';

var args = require('yargs').argv;
var getVariantGlob = require('./get-variant-glob.js');
var gulp = require('gulp');

var config = require('../gulp.config')();

var plugins = require('gulp-load-plugins')({lazy: true});

module.exports = buildVariantHTML;

function buildVariantHTML(variant) {
	var dest = args.dest ? args.dest : config.temp.app;
	return getVariantGlob(variant, 'html').then(build);

	function build(glob) {
		return gulp.src(glob)
			.pipe(plugins.addSrc(config.html.common))
			.pipe(plugins.htmlmin())
			.pipe(plugins.angularTemplatecache(config.templateCache.options))
			.pipe(plugins.concat(variant + '.templates.js'))
			.pipe(gulp.dest(dest + 'templates/'));
	}
}
