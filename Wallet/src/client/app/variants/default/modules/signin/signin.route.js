(function() {
	'use strict';

	angular
		.module('signin')
		.run(appRun);

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());

		function getStates() {
			return [
				{
					state: 'signin',
					config: {
						url: '/signin',
						templateUrl: 'app/modules/signin/signin.html',
						controller: 'SigninController',
						controllerAs: 'vm',
						title: 'Sign In'
					}
				}
			];
		}
	}
})();
