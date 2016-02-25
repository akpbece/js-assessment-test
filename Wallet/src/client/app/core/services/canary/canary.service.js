/**
 * @module factory: canary
 * @description Factory that returns the type of application variant and bundle
 */
(function() {
	'use strict';

	angular
		.module('core.canary')
		.factory('canary', canary);

	/* @ngInject */
	function canary(logger, $q, config, api, session) {
		var canaryData = {};
		var isInitialized = false;

		if (config.initialData && config.initialData.canary) {
			setCanary(config.initialData.canary.variantId, config.initialData.canary.bundleId);
			config.initialData.canary = null;
		}

		var service = {
			'get': getCanary,
			'set': setCanary
		};

		return service;

		/**
		 * @function getCanary
		 * @description This will request canary service that will return the
		 * variant and bundle once
		 * @return {Object}
		 */
		function getCanary() {
			var defer = $q.defer();
			logger.info('get canary set');

			if (isInitialized) {
				logger.info('canary is initialized. canary set is: ' + JSON.stringify(canaryData));

				defer.resolve(canaryData);
				return defer.promise;
			}
			else {
				logger.info('canary is not initialized');

				api.request('canary', {
					locale: session.get('locale') || config.defaultLocale
				}).then(function(json) {
					logger.info('canary set = ' + canaryData);

					isInitialized = true;
					canaryData = json;

					defer.resolve(canaryData);

				});

				return defer.promise;
			}
		}

		/**
		 * @function setCanary
		 * @description Sets the variant and bundle programmatically
		 * @param {String} variant Variant name
		 * @param {String} bundle  Bundle type
		 */
		function setCanary(variant, bundle) {
			if (!variant) {
				logger.info('variant is needed to set the canary');
				return;
			}

			// use variant as bundle if its not set
			if (!bundle) {
				bundle = variant;
			}

			canaryData = {variantId: variant, bundleId: bundle};
			isInitialized = true;
		}
	}

})();
