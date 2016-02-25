/**
 * @module app.core
 *
 * @description  This will create an angular module 'app.core' with dependencies
 * listed below
 */

(function() {
	'use strict';

	angular
		.module('app.core', [
			'ngAnimate',
			'ngMessages',
			'ngSanitize',
			'ui.router',
			'mpass-component-api',
			'mpass-component-flowstack',
			'mpass-component-post-msg',
			'mpass-component-session',
			'core.apiConfig',
			'core.bundle',
			'core.canary',
			'core.checkout',
			'core.components.router',
			'core.flows',
			'core.formValidation',
			'core.localeService',
			'core.logger',
			'formly',
			'formlyBootstrap'
		]);

})();
