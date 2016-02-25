(function() {
	'use strict';

	angular
		.module('userInformation')
		.run(appRun);

	/* @ngInject */
	function appRun(routerHelper, $stateParams) {
		routerHelper.configureStates(getStates());

		///////////////////

		/**
		 * @function getStates
		 * */
		function getStates() {
			return [
				{
					state: 'userInformation',
					config: {
						url: '/userInformation',
						templateUrl: 'app/modules/userInformation/userInformation.html',
						controller: 'UserInformationController',
						controllerAs: 'vm',
						title: 'User Information',
						params: {
							duplicate: $stateParams.duplicate
						}
					}
				}
			];
		}

	}

})();
