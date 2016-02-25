(function() {
	'use strict';

	angular
		.module('verifyForgotPassword')
		.run(appRun);

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: 'verifyForgotPassword',
				config: {
					url: '/verifyForgotPassword',
					templateUrl: 'app/modules/verifyForgotPassword/verifyForgotPassword.html',
					controller: 'VerifyForgotPasswordController',
					controllerAs: 'vm',
					title: 'Verify Forgot Password'
				}
			}
		];
	}
})();
