(function() {
	'use strict';

	/**
	 * Inject then copy over a list of dependencies for the variant we are serving.
	 * - > In Gulp:
	 * - > inject the directory list as the modules variable
	 * - > copy over as app.modules.js in the /modules/ directory.
	 * */

	var modules = 'inject_modules'.split(',');

	angular.module('app.modules', modules);

})();
