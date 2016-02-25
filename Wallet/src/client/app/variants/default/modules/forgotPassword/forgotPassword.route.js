(function() {
	'use strict';

	angular
		.module('forgotPassword')
		.run(appRun);

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: 'forgotPassword',
				config: {
					url: '/forgotPassword',
					templateUrl: 'app/modules/forgotPassword/forgotPassword.html',
					controller: 'ForgotPasswordController',
					controllerAs: 'vm',
					title: 'Forgot Password'
				}
			}
		];
	}
})();
