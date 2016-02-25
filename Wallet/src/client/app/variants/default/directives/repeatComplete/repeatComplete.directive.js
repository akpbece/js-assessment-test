(function() {
	'use strict';

	/**
	 * ng-repeat is asynchorous. This directive will emit `repeatCompleted` event
	 * in order for us to know that ng-repeat is done processing
	 */
	angular
		.module('app.directives')
		.directive('repeatComplete', repeatComplete);

	/* @ngInject */
	function repeatComplete($timeout) {
		return function(scope) {
			if (scope.$last) {
				$timeout(function() {
					scope.$emit('repeatCompleted');
				}, 1);
			}
		};
	}
})();
