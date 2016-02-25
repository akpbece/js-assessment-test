(function() {
	'use strict';

	angular
		.module('verifyPayment')
		.run(appRun);

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: 'verifyPayment',
				config: {
					url: '/verifyPayment',
					templateUrl: 'app/modules/verifyPayment/verifyPayment.html',
					controller: 'VerifyPaymentController',
					controllerAs: 'vm',
					title: 'Verify Payment'
				}
			}
		];
	}
})();
