'use strict';

var buildVariantHTML = require('../gulp-utils/build-variants-html.js');
var readSubDirectories = require('../gulp-utils/read-sub-directories.js');
var config = require('../gulp.config')();

module.exports = templates;

function templates() {
	return function(done) {
		var variantDir = config.variant.directory;
		var variants = readSubDirectories(variantDir);

		var completed = 0;

		variants.forEach(function(variant) {
			buildVariantHTML(variant)
				.then(function() {
					completed++;

					// let gulp know we are done
					if (completed === variants.length) {
						done();
					}
				}, function(e) {
					console.log('Error on build variants html: ' + e);
				});
		});
	};
}
