(function() {
	'use strict';

	angular
		.module('app.layout')
		.controller('ShellController', ShellController);

	/* @ngInject */
	function ShellController(
		$rootScope,
		$scope,
		config,
		logger,
		bundle,
		buildConfig,
		session,
		postMsg,
		localeService
	) {
		var app = this;
		var configBundleLoaded = false;

		// app level text object
		app.text = {};
		app.locale = '';
		app.bundleConfig = {};
		app.config = config;

		$scope.$on('configBundleLoaded', loadLocaleService);
		$scope.$on('configBundleChanged', loadLocaleService);
		$scope.$on(localeService.textLoadedEventName, changeText);

		activate();

		////////////////

		function activate() {
			logger.debug(config.appTitle + ' completed loading', null);

			// see if a locale is set if not load the default
			var locale = session.get('locale') || config.defaultLocale;

			app.locale = locale;

			bundle.get('config', config.tenant, locale)
				.then(function(bundle) {
					app.bundleConfig = bundle;

					logger.debug('config bundle loaded');
					config.init(bundle);

					configBundleLoaded = true;

					$scope.$broadcast('configBundleLoaded', bundle);

					logger.init(
						config.loggerConsoleLevels,
						config.loggerRemoveLevels,
						config.loggerRemotePath
					);

				});

			postMsg.on('changeLocale', changeLocale);
		}

		function loadLocaleService() {
			localeService.init(app.locale, app.bundleConfig.locales, $scope);
		}

		function changeLocale(locale) {
			logger.info('Received locale from switch ' + locale);

			localeService.setLocale(locale);
		}

		function changeText(event, textBundle) {
			app.text = textBundle;
		}
	}
})();
