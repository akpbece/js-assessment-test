(function() {
	'use strict';

	var flows = {
		registration: {
			stack: ['userInformation', 'shippingAddress', 'registrationConfirmation']
		},
		signin: {
			stack: ['signin', 'verifyPayment'],
			fallback: 'verifyPayment'
		}
	};

	angular.module('core.flows')
		.constant('flows', flows);

})();
