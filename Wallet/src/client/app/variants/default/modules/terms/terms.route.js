(function() {
	'use strict';

	angular
		.module('terms')
		.run(appRun);

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: 'terms',
				config: {
					url: '/terms',
					templateUrl: 'app/modules/terms/terms.html',
					controller: 'TermsController',
					controllerAs: 'vm',
					title: 'Terms & Condition'
				}
			}
		];
	}
})();
