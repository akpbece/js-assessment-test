(function() {
	'use strict';

	angular
		.module('verifyPayment')
		.controller('VerifyPaymentController', VerifyPaymentController);

	/* @ngInject */
	function VerifyPaymentController(
		$scope,
		logger,
		session,
		api,
		$interpolate,
		postMsg,
		checkout,
		$q,
		flowstack
	) {
		// jshint validthis: true
		var vm = this;
		var app = $scope.app;
		var paymentId;

		vm.title = 'Verify Payment';

		// Initial model to be populated by below's api calls
		vm.prefPaymentMethod = {};
		vm.merchantAcceptedCC = [];
		vm.shippingAddresses = [];

		/**
		 * This is the user selected/preferred shipping address
		 * When user is interacting with the carousel like tapping the carousel
		 * arrow or carousel buttons, swipingleft and swipingright, this will be
		 * populated with a shippingAddress Object
		 */
		vm.selectedShippingAddress = {};
		vm.suppressShippingAddress = (session.get('merchant.suppressShippingAddress') === 'true') ? true : false;

		vm.continueCheckout = continueCheckout;
		vm.addAddress = addShippingAddress;
		vm.getShippingDestination = getShippingDestination;

		activate();

		////////////////

		/**
		 * @function activate
		 * @description  Everything inside this function will automatically
		 * get called when the controller gets initialized
		 */
		function activate() {
			setMerchantAcceptedCard();
			interpolateMerchantName();

			api.request('getPaymentCard')
				.then(setPrefPaymentCard, fail);

			logger.info('Activated the Verify Payment View.');
		}

		function getShippingDestination() {
			var defer = $q.defer();

			// Grab the shipping destination object that have a preferred
			// flag that is true then place it in front of the array and
			// place the rest of it in the end
			api.request('getShippingDestination').then(function(response) {
				var sortedShippingAddress = _.reduce(response.shippingDestinations, setPreferredShippingAddressInFrontOfArray, []);

				vm.shippingAddresses = sortedShippingAddress;
				// The first entry is the preferred/selected shipping address
				vm.selectedShippingAddress = sortedShippingAddress[0];

				defer.resolve(sortedShippingAddress);
			}, fail);

			return defer.promise;
		}

		/**
		 * @function continueCheckout
		 * @description  Uses checkout service -
		 * completes the checkout
		 */
		function continueCheckout() {
			var checkoutRequest = {
				'paymentCardId': paymentId
			};
			if (!vm.suppressShippingAddress) {
				checkoutRequest.shippingDestinationId = vm.selectedShippingAddress.id;
			}

			function checkoutSuccess(response) {
				var message = {
					mpstatus: 'success',
					merchantCallbackUrl: (response.merchantCallbackUrl || null),
					verifyToken: (response.verifierToken || null),
					checkoutResourceUrl: (response.checkoutResourceUrl || null)
				};
				postMsg.send('completeCheckout', message);
			}

			/**
			 * Utilize the checkout service to complete checkout
			 * It will call the selections then checkout service
			 */
			checkout
				.doCheckout(checkoutRequest)
				.then(checkoutSuccess, fail);
		}

		function addShippingAddress() {
			flowstack.add('shippingAddress');
			flowstack.next({addNewShippingAddress:true});
		}

		/**
		 * Rethink how we need to do this app wide - todo
		 * */
		function interpolateMerchantName() {
			var text = $interpolate(app.text.checkoutConfirmationContinue);
			app.text.checkoutConfirmationContinue = text({merchant: session.get('merchant.name')});
		}

		/**
		 * @function setMerchantAcceptedCard
		 * @description Grab the merchant's allowed cards from session
		 */
		function setMerchantAcceptedCard() {
			var cardBrandArr = session.get('merchant.allowedCardTypes').split(',');
			// Only display 4 merchant accepted credit card
			vm.merchantAcceptedCC = cardBrandArr.splice(0, 4);
		}

		/**
		 * @function setPreferredShippingAddressInFrontOfArray
		 * @description This function will loop over an array of object,
		 * and look for the object that have a property of `preferred: true`
		 * and place that particular object to the front of the array.
		 * @param {Object} result  The shipping destinationarray
		 * @param {Object} curr    The current object being manipulated
		 * @param {Object} result  Concatenated array
		 */
		function setPreferredShippingAddressInFrontOfArray(result, curr) {
			curr.preferred ? result.unshift(curr) : result.push(curr);
			return result;
		}

		/**
		 * @function setPrefPaymentCard Sets the preferred obj on ctrl's scope
		 * @param {Object} response Payload coming from the paymentCard service
		 */
		function setPrefPaymentCard(response) {
			var prefPaymentMethod = getPreferredData(response.paymentCards)[0];
			// Grab last 8 digits of credit card
			prefPaymentMethod.maskedAccountNumber = prefPaymentMethod.maskedAccountNumber
					.substr(prefPaymentMethod.maskedAccountNumber.length - 4);
			vm.prefPaymentMethod = prefPaymentMethod;
			paymentId = response.paymentCards[0].id;
		}

		/**
		 * @function fail
		 * @param  {Object} request A string describing the type of error
		 * @param  {String} status  Error Status
		 * @param  {String} error   Textual portion of the HTTP status
		 */
		function fail(request, status, error) {
			logger.error('Verify Payment Error: ', error);
		}

		/**
		 * @function getPreferredData
		 * @param  {Array}  arr Array of Object
		 * @return {Object} obj Object that contains preferred as true
		 */
		function getPreferredData(arr) {
			return _.filter(arr, function(obj) {
				return obj.preferred;
			});
		}

	}
})();
