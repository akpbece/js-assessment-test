/**
 * @module controller: ResetForgotPasswordController
 * @description This module will manage Reset Forgot Password.
 */
(function() {
	'use strict';

	angular
		.module('resetForgotPassword')
		.controller('ResetForgotPasswordController', ResetForgotPasswordController);

	/* @ngInject */
	function ResetForgotPasswordController($scope, api, flowstack, validations, logger, localeService) {
		/* jshint validthis: true */
		var vm = this;
		var app = $scope.app;

		vm.resetForgotPasswordClick = resetForgotPasswordClick;

		$scope.$on(localeService.textLoadedEventName, createResetForgotPasswordFormField);

		activate();

		function activate() {
			createResetForgotPasswordFormField();
			logger.info('Activated the Create New Forgot Password View.');
		}

		/**
		 * @function resetForgotPasswordClick
		 * @description After verify generate auth code it will navigate to reset password screen and call
		 * resetForgotPassword api to wallet server
		 * {Success} : In case of successful response from wallet server then it will redirected
		 * to signin module with successfully password reset message log.
		 * {Failure} : In case of failure response from wallet server show the user validate message description
		 * {reasonCode} PASSWORD_POLICY_MISMATCH : Password is not in compliance with password policy.
		 * {reasonCode} WALLET_LOCKED_AND_RESET_NOT_ALLOWED : We are sorry, but we are unable to verify your identity
		 * and your account has been temporarily locked.
		 * {reasonCode} WALLET_TEMP_LOCKED : We are sorry, but we are unable to verify your identity and your account
		 * has been temporarily locked.
		 */
		function resetForgotPasswordClick() {
			var resetForgotPasswordRequestData = {
				password: vm.resetForgotPasswordDetail.password
			};

			// api request for validate login to wallet server
			api.request('resetForgotPassword', resetForgotPasswordRequestData)
				.then(resetForgotPasswordSuccessResponse, resetForgotPasswordFailureResponse);

			function resetForgotPasswordSuccessResponse(response) {
				logger.info('Forgot Password Updation Processed : ' + response);
				if (response.success === 'true' || response.success === true) {
					flowstack.add('signin');
					flowstack.next();
					logger.log('Your Password is reset successfully.');
				} else if (response.errors !== undefined) {
					handleResetForgotPasswordErrors(response.errors);
				}
			}

			function resetForgotPasswordFailureResponse(response) {
				logger.error('Failed to update password : ' + response);
			}

			function handleResetForgotPasswordErrors(errors) {
				vm.resetForgotPasswordErrorMsg = errors[0].description;
				vm.options.resetModel();
			}
		}

		/**
		 * @function createResetForgotPasswordFormField
		 * @description This will assign form fields for Reset Forgot Password
		 * formly form. We can add new fields here as per requirement.
		 */
		function createResetForgotPasswordFormField() {
			vm.resetForgotPasswordFormField = [
				{
					fieldGroup: [
						{
							className: 'col-sm-8 col-xs-8',
							key: 'password',
							name: 'password',
							type: 'input',
							templateOptions: {
								label: app.text.passwordLabel,
								placeholder: app.text.resetForgotPasswordPlaceHolder,
								type: 'password',
								onFocus: function() {
									vm.resetForgotPasswordErrorMsg = '';
								}
							},
							validators: {
								max: {
									expression: validations.passwordMaxValidator,
									message: app.text.maxPasswordLength
								},
								min: {
									expression: validations.passwordMinValidator,
									message: app.text.minPasswordLength
								},
								required: {
									expression: validations.required,
									message: app.text.requiredField
								}
							},
							expressionProperties: {
								'templateOptions.type': function() {
									return vm.resetForgotPasswordDetail.showPassword ? 'text' : 'password';
								}
							}
						}
					]
				},
				{
					className: 'col-sm-4 col-xs-4',
					key: 'showPassword',
					name: 'showPassword',
					type: 'checkbox',
					templateOptions: {
						label: app.text.showPasswordLabel
					}
				}
			];
		}

	}

})();
