(function() {
	'use strict';

	angular
		.module('verifyUserAuth')
		.run(appRun);

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: 'verifyUserAuth',
				config: {
					url: '/verifyUserAuth',
					templateUrl: 'app/modules/verifyUserAuth/verifyUserAuth.html',
					controller: 'VerifyUserAuthController',
					controllerAs: 'vm',
					title: 'Verify Unrecognized Signed User'
				}
			}
		];
	}
})();
