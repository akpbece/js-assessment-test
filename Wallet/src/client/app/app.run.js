(function() {
	'use strict';

	/* jshint -W074 */ // fixme : cyclomatic complexity

	angular.module('app')
		.run(run);

	/* jshint -W072 */ // injecting more than the configured number of parameters
	/* @ngInject */
	function run(
		config,
		buildConfig,
		initialData,
		session,
		apiConfig,
		flowstack,
		api,
		postMsg,
		$window,
		$rootScope,
		logger,
		flows
	) {
		var urlParams = initialData.location.params;

		// Init the api for wallet
		// basePath is usually empty (same host) but remote server for local dev
		apiConfig.baseConfig.basePath = buildConfig.serviceUrl;
		api.init(apiConfig);

		// flows init
		flowstack.init(flows);

		// Add data that was generated from the conductor to the app config.
		config.initialData = initialData;
		config.buildUrls = {
			bundleUrl: buildConfig.bundleUrl
		};

		// put the intial url param data into the session
		storeUrlParams(urlParams);

		// setup post message to communicate with switch,
		// switch passes its origin to wallet via URL param 'clientOrigin' for historical reasons
		postMsg.config($window.parent, urlParams.clientOrigin, urlParams.clientOrigin);
		postMsg.send('walletInitialized').then(initializePostMsgSuccess, initializePostMsgFail);

		handleRoutingSuccesses();

		//////////////

		///// TODO --- THIS BEGINS AN IMPORTANT TODO /////

		/**
		 * @function initializePostMsgSuccess
		 * @description GET THE INITIAL DATA FROM SWITCH TO LAUNCH A PHOENIX FLOW IN THE WALLET
		 * PLEASE NOTE, THIS NEEDS A LOT OF ADDITIONAL WORK AND THIS IS NOT THE FLOW FROM THE URL PARAMETERS
		 * THIS IS A FLOW TO LAUNCH A NEW PHOENIX EXPERIENCE IN THE NEW WALLET APP, WE NEED TO CONSIDER THAT
		 * WE LIKELY WILL NEED TO USE THE URL FLOW PARAMETER HERE AS WELL IN THE NEAR FUTURE
		 * */
		function initializePostMsgSuccess(response) {
			var flow = response.flow;

			if (!flow) {
				throw new Error('Wallet Does not know where to start, error in post message wallet initialization');
			} else {
				session.set('flow', flow);
			}

			// set the data in session according to the flow
			switch (flow) {
				case 'signin':
					session.set('username', response.username);
					break;
				case 'registration' :
					session.set('registrationDataFromSwitch', response.registrationData);
					session.set('usernameType', response.registrationData.usernameType);
					break;
				default:
					// what should the default 'flow' be in wallet, if we hit this we are in trouble.
			}

			// store all merchant.<property> session values from switch
			if (response.merchantData) {
				_.each(response.merchantData, function(value, key) {
					session.set(key, value);
				});
			}

			// setting device fingerprint for wallet.
			session.set('fingerprint', response.fingerprint);

			// start the flow given to us by switch
			flowstack.use(flow).next();
		}

		///// TODO --- THIS ENDS THE REALLY IMPORTANT TODO /////

		/**
		 * @function initializePostMsgFail
		 * @description function to catch the error if the postMsg service fails
		 * */
		function initializePostMsgFail(error) {
			logger.debug('Failure to get flow and init data from switch', error);
		}

		/**
		 * @function storeUrlParams
		 * @param {Object} params hash of initial url params passed in by merchant
		 * @description takes a hash of params from the intial url, and
		 * places them into session for later service calls
		 */
		function storeUrlParams(params) {
			// TODO: in switch we should only pass the url data needed for PHW wallets,
			// in WLW we should just look at the post Msg instead of url params

			// manually map params to values so we explicit know what we're
			// storing and under a defined internal name

			session.set('locale', params.locale ? params.locale.toLowerCase() : undefined);

			// wallet params
			session.set('wallet.id', params['wallet_id'] || undefined);

			// prefer v6+ param naming when given both
			// oauth token
			session.set('oauthToken', params.requestToken || params['oauth_token'] || undefined);
		}

		/**
		 * @function handleRoutingSuccesses
		 * @description handle the $stateChangeSucess event
		 */
		function handleRoutingSuccesses() {
			$rootScope.$on('$stateChangeSuccess', stateChangeSucess);

			function stateChangeSucess(/*event, toState, toParams, fromState, fromParams*/) {
				// Scroll Wallet frame back to top
				$window.scrollTo(0, 0);

				// Send post message to switch telling it to also scroll
				postMsg.send('scrollToTop');
			}
		}
	}

})();
