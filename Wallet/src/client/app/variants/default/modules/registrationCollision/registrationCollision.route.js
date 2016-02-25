(function() {
	'use strict';

	angular
		.module('registrationCollision')
		.run(appRun);

	/* @ngInject */
	function appRun(routerHelper, $stateParams) {
		routerHelper.configureStates(getStates());

		function getStates() {
			return [
				{
					state: 'registrationCollision',
					config: {
						url: '/registrationCollision',
						templateUrl: 'app/modules/registrationCollision/registrationCollision.html',
						controller: 'RegistrationCollisionController',
						controllerAs: 'vm',
						title: 'Registration Collision',
						params: {
							secondaryCredentialType: $stateParams.secondaryCredentialType
						}
					}
				}
			];
		}
	}
})();
