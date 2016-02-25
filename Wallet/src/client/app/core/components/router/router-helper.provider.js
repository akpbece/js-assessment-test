/* Help configure the state-base ui.router */
(function() {
	'use strict';

	angular
		.module('core.components.router')
		.provider('routerHelper', routerHelperProvider);

	/* @ngInject */
	function routerHelperProvider($stateProvider, $locationProvider) {
		/* jshint validthis:true */
		var config = {
			resolveAlways: {}
		};

		// Leaving this off broke a few things with the flowstack/back button on
		// modern browsers so we'll just turn it off in IE
		// documentMode is only available in IE
		if (!document.documentMode) {
			$locationProvider.html5Mode(true);
		}

		this.$get = RouterHelper;
		// this.configure = configure; // NOTE: this method came with a generator but is unused

		///////////

		// NOTE: this method came with a generator but is unused
		// function configure(cfg) {
		// 	_.extend(config, cfg);
		// }

		/* @ngInject */
		function RouterHelper($location, logger, $rootScope/*, $state*/) {
			var service = {
				configureStates: configureStates,
				// getStates: getStates, // NOTE: this method came with a generator but is unused
				hasOtherwisePath: false,
				hasHandlingStateChangeError: false,
				stateCounts: {
					errors: 0,
					changes: 0
				}
			};

			init();

			return service;

			///////////////

			// NOTE: this method came with a generator but is unused
			// function getStates() {
			// 	return $state.get();
			// }

			function configureStates(states/*, otherwisePath*/) {
				_.each(states, function(state) {
					state.config.resolve = _.extend(state.config.resolve || {}, config.resolveAlways);
					$stateProvider.state(state.state, state.config);
				});

				// NOTE: this method came with a generator but is unused
				// if (otherwisePath && !service.hasOtherwisePath) {
				// 	service.hasOtherwisePath = true;
				// 	$urlRouterProvider.otherwise(otherwisePath);
				// }
			}

			function init() {
				handleRoutingSuccesses();
				handleRoutingErrors();
			}

			function handleRoutingSuccesses() {
				$rootScope.$on('$stateChangeSuccess', stateChangeSucess);

				function stateChangeSucess(/*event, toState, toParams, fromState, fromParams*/) {
					service.stateCounts.changes++;
					service.hasHandlingStateChangeError = false;
				}
			}

			function handleRoutingErrors() {
				// Route cancellation:
				// On routing error, go to the dashboard.
				// Provide an exit clause if it tries to do it twice.
				$rootScope.$on('$stateChangeError', stateChangeError);

				function stateChangeError(event, toState, toParams, fromState, fromParams, error) {
					if (service.hasHandlingStateChangeError) {
						return;
					}
					var msg = compriseErrorMessage(toState, error);
					service.stateCounts.errors++;
					service.hasHandlingStateChangeError = true;
					logger.warning(msg, [toState]);
					$location.path('/');
				}
			}

			function compriseErrorMessage(toState, error) {
				error = error || {};
				var destination = (toState &&
					(toState.title || toState.name || toState.loadedTemplateUrl)) ||
					'unknown target';

				return 'Error routing to ' + destination + '. ' +
					(error.data || '') + '. <br/>' + (error.statusText || '') +
					': ' + (error.status || '');
			}

		}
	}
})();
