/**
 * @module factory: bundle
 */
(function() {
	'use strict';

	angular
		.module('core.bundle')
		.factory('bundle', bundle);

	/* @ngInject */
	function bundle($http, logger, canary, $q, config) {
		var serviceUrl;
		if (config.buildUrls) {
			serviceUrl = config.buildUrls.bundleUrl;
		}
		else {
			logger.error('no canary url configured');
		}

		/**
		 * Bundles Object cache results of bundle text or configuration
		 */
		var bundles = {
			text: [],
			config: []
		};

		var service = {
			'get': get
		};

		return service;

		/**
		 * @function get
		 * @param  {String} type     Text or Configuration
		 * @param  {String} tenant   Tenant
		 * @param  {String} bundleId Language/Locale
		 * @return {Object} promise
		 */
		function get(type, tenant, bundleId) {
			var defer = $q.defer();

			/**
			 * Check if bundle exists, if it is not request a canary
			 * service then cache it.
			 */
			if (!bundles[type][bundleId]) {
				remote(type, tenant, bundleId)
					.then(function(result) {
						logger.info('retrieved remote - Type is:');
						logger.info(type);

						bundles[type][bundleId] = result;
						defer.resolve(result);
					});

				return defer.promise;
			}
			/**
			 * If bundle already exists, just return the bundle. No need
			 * to request it again.
			 */
			else {
				defer.resolve(bundles[type][bundleId]);
				return defer.promise;
			}
		}

		/**
		 * @function remote
		 * @param  {String} type     Text or Configuration
		 * @param  {String} tenant   Tenant
		 * @param  {String} bundleId Language/Locale
		 * @return {Object} promise
		 */
		function remote(type, tenant, bundleId) {

			var defer = $q.defer();

			canary.get()
				.then(function(canaryData) {
					logger.info('getting bundle for canary set name = ' + canaryData.bundleId);

					// todo - data.json is coded as the endpoint for this request here, should make this mo-better
					var bundlePath = [serviceUrl, tenant, canaryData.bundleId, bundleId, type + '.json'].join('/');
					$http.get(bundlePath).success(function(data) {
						defer.resolve(data);
					});
				});

			return defer.promise;
		}
	}
})();
