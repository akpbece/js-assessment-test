(function() {
	'use strict';

	/**
	 * Api Configuration object
	 * @note see mpass-component-api for documentation
	 * */
	var apiConfig = {
		baseConfig: {
			basePath: '' // we set this in app run from the build data from conductor.
		},
		requestNames: {
			canary: {
				basePath: 'mocks/',
				endpoint: 'canary/data.json',
				method: 'GET'
			},
			countries: {
				// live endpoint:
				// endpoint: '/wallet/clientapi/walletapi/public/v6/country/:walletId',
				basePath: 'mocks/',
				endpoint: 'country/data.json',
				method: 'GET'
			},
			countrySubDivision: {
				// live endpoint:
				endpoint: '/wallet/clientapi/walletapi/public/v6/country/:countryCode/countrysubdivision',
				//basePath: 'mocks/',
				//endpoint: 'countrySubDivision/:countryCode/data.json',
				method: 'GET'
			},
			/**
			 * login
			 * */
			login: {
				endpoint: '/wallet/clientapi/walletapi/public/v6/acmebank/chameleonweb/login',
				//basePath:'/api/',
				//endpoint: 'login',
				method: 'POST'
			},
			/**
			 * Profile
			 * */
			getProfile: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/profile',
				method: 'GET'
			},
			createProfile: {
				endpoint: '/wallet/clientapi/walletapi/public/v6/:walletId/chameleonweb/profile',
				method: 'POST'
			},
			updateProfile: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/chameleonweb/profile',
				method: 'PUT'
			},
			rememberUserName: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/chameleonweb/rememberUser',
				method: 'POST'
			},
			/**
			 * paymentCard
			 * */
			savePaymentCard: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/paymentcard',
				method: 'POST'
			},
			getPaymentCard: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/paymentcard',
				method: 'GET'
			},
			/**
			 * shippingDestination
			 * */
			getShippingDestination: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/shippingdestination',
				method: 'GET'
			},
			saveShippingDestination: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/shippingdestination',
				method: 'POST'
			},
			/**
			 * Checkout
			 * */
			selections: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/checkout/selections',
				method: 'POST'
			},
			checkout: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/checkout',
				method: 'POST'
				//basePath: 'mocks/',
				//endpoint: 'checkout/data.json',
				//method: 'GET'
			},
			generateAuthCode: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/chameleonweb/authcode/generate',
				method: 'POST'
			},
			verifyAuthCode: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/chameleonweb/authcode/verify',
				method: 'POST'
			},
			resendAuthCode: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/chameleonweb/authcode/resend',
				method: 'POST'
			},
			verifyAuthCodeForVerifyForgotPassword: {
				//basePath: '/api/',
				//endpoint: 'verifyAuthCode',
				endpoint: '/wallet/clientapi/walletapi/public/v6/acmebank/chameleonweb/authcode/verify',
				method: 'POST'
			},
			resendAuthCodeForVerifyForgotPassword: {
				//basePath: '/api/',
				//endpoint: 'resendAuthCode',
				endpoint: '/wallet/clientapi/walletapi/public/v6/acmebank/chameleonweb/authcode/resend',
				method: 'POST'
				// basePath: 'mocks/',
				// endpoint: 'checkout/data.json',
				// method: 'GET'
			},
			retrievePaymentCard: {
				//basePath: 'retrievePaymentCard',
				//endpoint: '/retrievePaymentCard',
				endpoint: '/wallet/clientapi/walletapi/private/v6/paymentcard',
				method: 'GET'
			},
			updateLegalDocs: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/updatelegaldocs',
				method: 'POST'
			},
			forgotPassword: {
				endpoint: '/wallet/clientapi/walletapi/public/v6/acmebank/chameleonweb/forgotPassword',
				//basePath: '/api/',
				//endpoint: 'forgotPassword',
				method: 'POST'
			},
			resetForgotPassword: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/chameleonweb/resetpassword',
				//basePath: '/api/',
				//endpoint: 'resetForgotPassword',
				method: 'POST'
			}
		}
	};

	angular.module('core.apiConfig')
		.constant('apiConfig', apiConfig);

})();
