(function() {
	'use strict';

	angular
		.module('registrationConfirmation')
		.run(appRun);

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: 'registrationConfirmation',
				config: {
					url: '/registrationConfirmation',
					templateUrl: 'app/modules/registrationConfirmation/registrationConfirmation.html',
					controller: 'RegistrationConfirmationController',
					controllerAs: 'vm',
					title: 'Registration Confirmation',
					disableBack: true
				}
			}
		];
	}
})();
