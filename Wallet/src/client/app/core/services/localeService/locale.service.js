/**
 * @module factory: localeService
 * @description Service that manages the state of the locale
 */
(function() {
	'use strict';

	angular
		.module('core.localeService')
		.factory('localeService', localeService);

	/* @ngInject */
	function localeService(config, bundle, logger) {
		var $scope;
		var filters = {};
		var currentLocale;
		var locales = [];
		var initialized = false;

		var service = {
			localeChangeEventName: 'LocaleChanged',
			localeFilterUpdated: 'FilterUpdated',
			textLoadedEventName: 'TextLoaded',

			init: init,
			addFilter: addFilter,
			removeFilter: removeFilter,
			getLocale: getLocale,
			setLocale: setLocale,
			getLocales: getLocales
		};

		return service;
		/////////////////////////

		/**
		 * @external Scope
		 * @see {@link https://code.angularjs.org/1.3.20/docs/api/ng/type/$rootScope.Scope#}
		 * */

		/**
		 * @function init
		 * @description Initialize service with full list of locales and current locale
		 * @param {String} initialLocale The locale to initialize with
		 * @param {Array} fullLocaleArray The list of locales to initialize with
		 * @param {external:Scope} scope The scope that the service will broadcast events to
		 * */
		function init(initialLocale, fullLocaleArray, scope) {
			/*jshint validthis: true */
			$scope = scope;
			locales = fullLocaleArray;
			initialized = true;
			this.setLocale(initialLocale);
		}

		/**
		 * @function addFilter
		 * @description Add a named filter
		 * @param {String} filterName The name of the new filter
		 * @param {Function} filterFunction The filter to add
		 * */
		function addFilter(filterName, filterFunction) {
			checkInitialization();
			filters[filterName] = filterFunction;
			$scope.$broadcast(service.localeFilterUpdated, filterName);
		}

		/**
		 * @function removeFilter
		 * @description Remove a named filter
		 * @param {String} filterName The name of the filter to remove
		 * */
		function removeFilter(filterName) {
			checkInitialization();
			delete filters[filterName];
			$scope.$broadcast(service.localeFilterUpdated, filterName);
		}

		/**
		 * @function getFilter
		 * @description Retrieve a named filter
		 * @param {String} filterName The name of the filter to retrieve
		 * @returns {Function}
		 * @private
		 * */
		function getFilter(filterName) {
			checkInitialization();
			return filters[filterName];
		}

		/**
		 * @function getLocales
		 * @description Returns a list of available locales honoring all filters
		 * @returns {Array}
		 * */
		function getLocales() {
			checkInitialization();
			var filteredLocales = locales;

			_.each(_.keys(filters), function(name) {
				filteredLocales = _.filter(filteredLocales, getFilter(name));
			});

			return filteredLocales;
		}

		/**
		 * @function getLocale
		 * @description Get the current locale string
		 * @returns {String}
		 * */
		function getLocale() {
			/*jshint validthis: true */
			checkInitialization();
			return currentLocale;
		}

		/**
		 * @function setLocale
		 * @description Change locale to specified value and loads new bundle
		 * @param {String} newLocale The new locale
		 * */
		function setLocale(newLocale) {
			/*jshint validthis: true */
			checkInitialization();
			var self = this;

			// Set current locale if it exists in list of available locales
			_.each(self.getLocales(),function(locale) {
				if (locale.value === newLocale) {
					currentLocale = locale.value;
				}
			});

			loadBundle.call(self)
				.then(function() {
					$scope.$broadcast(self.localeChangeEventName, newLocale);
				});
		}

		/**
		 * @function loadBundle
		 * @description Retrieve the text bundle for the current locale
		 * @returns {Promise}
		 * */
		function loadBundle() {
			/*jshint validthis: true */
			checkInitialization();
			var self = this;
			var locale = currentLocale;
			var deferred = $.Deferred();

			// get the bundle based on the current locale
			bundle.get('text', config.tenant, locale)
				.then(function(bundle) {
					logger.debug('text bundle loaded');
					$scope.$broadcast(self.textLoadedEventName, bundle);
					deferred.resolve(bundle);
				});

			return deferred.promise();
		}

		/**
		 * @function checkInitialized
		 * @description Check that service has been initialized and throw an error if it hasn't
		 * */
		function checkInitialization() {
			if (!initialized) {
				throw new Error('Locale Service has not been initialized');
			}
		}
	}
})();
