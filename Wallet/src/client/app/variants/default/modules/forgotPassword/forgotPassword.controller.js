/**
 * @module controller: ForgotPasswordController
 * @description This module will manage wallet Forgot Password.
 */
(function() {
	'use strict';

	angular
		.module('forgotPassword')
		.controller('ForgotPasswordController', ForgotPasswordController);

	/* @ngInject */
	function ForgotPasswordController($scope, api, flowstack, validations, logger, localeService, session) {
		/* jshint validthis: true */
		var vm = this;
		var app = $scope.app;

		vm.forgotPasswordErrorMsg = '';
		vm.forgotPasswordClick = forgotPasswordClick;

		$scope.$on(localeService.textLoadedEventName, createForgotPasswordFormField);

		activate();

		function activate() {
			createForgotPasswordFormField();
			logger.info('Activated the Create Forgot Password View.');
		}

		/**
		 * @function forgotPasswordClick
		 * @description After forgot password click it will request via either EMAIL or PHONE in forgotPassword api
		 * to wallet server
		 * {Success} : In case of successful response from wallet server then it will redirected
		 * to next verify forgot password module.
		 * {Failure} : In case of failure response from wallet server show the user validate message description
		 * {reasonCode} AUTH_UNSPECIFIED_LOGIN_ERROR : Sorry, we couldn't recognize you. Please try again.
		 * {reasonCode} NOTIFICATION_FAILURE : We found error while sending you OTP. Please try again.
		 * {reasonCode} AUTH_CODE_GENERATION_FAIL : Sorry, we found error while generating OTP. Please try again.
		 */
		function forgotPasswordClick() {
			var userNameType = getUserNameType(vm.forgotPasswordDetail.username);
			var forgotPasswordRequestData;
			if (userNameType === 'emailAddress') {
				forgotPasswordRequestData = {
					emailAddress: vm.forgotPasswordDetail.username
				};
				session.set('userNameType', 'EMAIL');
				session.set('userName', vm.forgotPasswordDetail.username);

			} else {
				forgotPasswordRequestData = {
					'mobilePhone': {
						'countryCode': 'US+1',
						'phoneNumber': vm.forgotPasswordDetail.username
					}
				};
				session.set('userNameType', 'PHONE');
				session.set('userName', vm.forgotPasswordDetail.username);
			}

			// api request for validate User to wallet server
			api.request('forgotPassword', forgotPasswordRequestData)
				.then(forgotPasswordSuccessResponse, forgotPasswordFailureResponse);

			function forgotPasswordSuccessResponse(response) {
				logger.info('Forgot Password User Validate Processed : ' + response);
				if (response.success === 'true' || response.success === true) {
					flowstack.add('verifyForgotPassword');
					flowstack.next();
				} else if (response.errors !== undefined) {
					handleForgotPasswordErrors(response.errors);
				}
			}

			function forgotPasswordFailureResponse(response) {
				logger.error('Failed to update password : ' + response);
			}

			function handleForgotPasswordErrors(errors) {
				var errorCodes = _.pluck(errors, 'reasonCode');
				if (errorCodes.indexOf('SYSTEM_ERROR') !== -1) {
					vm.options.resetModel();
					vm.forgotPasswordErrorMsg = errors[0].description;
					logger.info('Internal server error');
				}
				else if (errorCodes.indexOf('AUTH_UNSPECIFIED_LOGIN_ERROR') !== -1) {
					vm.options.resetModel();
					vm.forgotPasswordErrorMsg = errors[0].description;
					logger.info('Unspecified login found');
				}
				else if (errorCodes.indexOf('NOTIFICATION_FAILURE') !== -1) {
					vm.options.resetModel();
					vm.forgotPasswordErrorMsg = errors[0].description;
					logger.info('Notification failure occured');
				}
			}
		}

		/**
		 * @function getUserNameType
		 * @description This function is used for identifying username type in Forgot Password Module.
		 * @param {String} userName
		 */
		function getUserNameType(userName) {
			return (userName.indexOf('@') > -1) ? 'emailAddress' : 'phoneNumber';
		}

		/**
		 * @function createForgotPasswordFormField
		 * @description This will assign form fields for Forgot Password
		 * formly form. We can add new fields here as per requirement.
		 */
		function createForgotPasswordFormField() {
			vm.forgotPasswordFormField = [
				{
					fieldGroup: [
						{
							key: 'username',
							name: 'username',
							type: 'input',
							templateOptions: {
								label: app.text.usernameLabel,
								placeholder: app.text.usernamePlaceholder,
								userNameChangeLabel: app.text.usernamePlaceholder,
								onFocus: function() {
									vm.forgotPasswordErrorMsg = '';
								}
							},
							validators: {
								required: {
									expression: validations.required,
									message: app.text.requiredField
								},
								username: {
									expression: validations.usernameValidator,
									message: app.text.userNameValidation
								}
							}
						}
					]
				}
			];
		}
	}
})();
