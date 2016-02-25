(function() {
	'use strict';

	angular
		.module('resetForgotPassword')
		.run(appRun);

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: 'resetForgotPassword',
				config: {
					url: '/resetForgotPassword',
					templateUrl: 'app/modules/resetForgotPassword/resetForgotPassword.html',
					controller: 'ResetForgotPasswordController',
					controllerAs: 'vm',
					title: 'Reset Forgot Password'
				}
			}
		];
	}
})();
