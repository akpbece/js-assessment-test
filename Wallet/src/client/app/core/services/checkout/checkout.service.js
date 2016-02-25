/**
 * @service checkout
 * @description calls checkout/selection with the user choices,
 * then if that is successful, it calls the checkout service and returns the results
 * */

(function() {
	'use strict';

	angular
		.module('core.checkout')
		.factory('checkout', checkout);

	/* @ngInject */
	function checkout(logger, api, session, $q) {
		var service = {
			'doCheckout': doCheckout
		};

		return service;

		function doCheckout(checkoutData) {
			var defer = $q.defer();

			var selectionsRequestData = {
				'precheckoutTransactionId': null,
				'checkoutSelection': {
					'paymentCardId': checkoutData.paymentCardId,
					'digitalGoods': ((session.get('merchant.suppressShippingAddress') === 'true') ? true : false),
					'timeStamp': (moment().utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z'), // TODO: generic timestamp function
					'merchantCheckoutId': session.get('merchant.checkoutId')
					// 'loyaltyCardId': null
				}
			};
			if (checkoutData.shippingDestinationId) {
				selectionsRequestData.checkoutSelection.shippingDestinationId = checkoutData.shippingDestinationId;
			}

			// Selections call will always go first
			api.request('selections', selectionsRequestData).then(function(selectResponse) {
				// Checkout call is always made after selections
				api.request('checkout', {
					'merchantCheckoutId': session.get('merchant.checkoutId'),
					'checkoutUrlVersion': session.get('merchant.checkoutVersion'),
					'oauthToken': session.get('oauthToken'),
					'precheckoutTransactionId': selectResponse.addCheckoutSelectionsResponse.precheckoutTransactionId
				}).then(function(response) {
					if (response.checkout) {
						defer.resolve(response.checkout);
					} else {
						defer.reject('Checkout empty', response);
					}
				}, function(err) {
					logger.error('Checkout Call error : ', err);
					defer.reject('Checkout error ', err);
				});
			});

			return defer.promise;
		}
	}
})();
