/**
 * @module controller: TermsController
 * @description This module will manage wallet T & C.
 */
(function() {
	'use strict';

	angular
		.module('terms')
		.controller('TermsController', TermsController);

	/* @ngInject */
	function TermsController($scope, api, flowstack, validations, logger, localeService) {
		/* jshint validthis: true */
		var vm = this;
		var app = $scope.app;
		vm.termsConditionCancelled = termsConditionCancelled;
		vm.termsConditionAccepted = termsConditionAccepted;

		// request param for updateLegalDocs
		vm.legalTermsRequest = {
			termsOfUseAccepted: true,
			privacyPolicyAccepted: true,
			cookiePolicyAccepted: false
		};

		$scope.$on(localeService.textLoadedEventName, createFormFields);

		activate();

		///////////////

		function activate() {
			createFormFields();
			logger.info('Activated Wallet Terms and Conditions Page.');
		}

		/**
		 * @function termsConditionCancelled
		 * @description This will redirected flow from Terms and Conditions to Sign in Module
		 */
		function termsConditionCancelled() {
			flowstack.back('signin');
			flowstack.next();
		}

		/**
		 * @function termsConditionAccepted
		 * @description This will Validate updateLegalDocs with wallet server for user
		 */
		function termsConditionAccepted() {
			// api request for updateLegalDocs to wallet server
			api.request('updateLegalDocs', vm.legalTermsRequest).then(success, fail);

			function success() {
				flowstack.add('verifyPayment');
				flowstack.next();
			}

			function fail() {
				logger.error('Re-Acceptance Terms and condition Failed');
			}
		}

		/**
		 * @function createFormFields
		 * @description This will assign form fields for Terms and Conditions
		 * formly form. We can add new fields here as per requirement.
		 */
		function createFormFields() {
			vm.fields = [
				{
					fieldGroup: [
						{
							key: 'isTCAccepted',
							name: 'isTCAccepted',
							type: 'checkbox',
							templateOptions: {
								label: app.text.acceptTermsCheck
							},
							validators: {
								required: {
									expression: validations.required,
									message: app.text.requiredTerms
								}
							}
						}
					]
				}
			];
		}
	}

})();
