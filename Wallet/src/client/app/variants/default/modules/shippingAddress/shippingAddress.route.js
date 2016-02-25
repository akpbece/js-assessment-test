(function() {
	'use strict';

	angular
		.module('shippingAddress')
		.run(appRun);

	/* @ngInject */
	function appRun(routerHelper, $q, api, $stateParams, session) {
		routerHelper.configureStates(getStates());

		function getCountries() {
			var defer = $q.defer();
			api.request('countries').then(success, fail);

			function success(response) {
				defer.resolve(response.countries);
			}

			function fail(error) {
				defer.reject(error);
			}

			return defer.promise;
		}

		function getStates() {
			return [
				{
					state: 'shippingAddress',
					config: {
						url: '/shippingAddress',
						templateUrl: 'app/modules/shippingAddress/shippingAddress.html',
						controller: 'ShippingAddressController',
						controllerAs: 'vm',
						title: 'Shipping Address',
						params: {
							shippingAddressNotSupported: $stateParams.shippingAddressNotSupported,
							addNewShippingAddress: $stateParams.addNewShippingAddress
						},
						resolve: {
							countries: getCountries
						},
						isVisible: function() {
							var isVisible = !session.get('flow.skipShippingAddress');
							session.remove('flow.skipShippingAddress');
							return isVisible;
						}
					}
				}
			];
		}

	}

})();
