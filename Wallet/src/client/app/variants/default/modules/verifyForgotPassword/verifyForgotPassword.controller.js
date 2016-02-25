/**
 * @module controller: VerifyForgotPasswordController
 * @description This module will manage wallet Verify Forgot Password.
 */
(function() {
	'use strict';

	angular
		.module('verifyForgotPassword')
		.controller('VerifyForgotPasswordController', VerifyForgotPasswordController);

	/* @ngInject */
	function VerifyForgotPasswordController($scope, api, flowstack, validations, session, logger, localeService) {
		/* jshint validthis: true */
		var vm = this;
		var app = $scope.app;

		vm.userSignInType = session.get('userNameType');
		vm.userSignInValue = session.get('userName');

		// TODO: Remove this when tenant portal configure this value and getting runtime
		vm.secondary2faConfigLabel = 'Label';
		vm.secondary2faConfigPlaceHolder = 'Place Holder ';
		vm.secondary2faConfigMessage = 'Message';

		vm.uniqueCodeErrorMessage = '';
		vm.secondarySecurityTxtIpt = true;

		vm.flagInvalidAutCodeMessage = false;
		vm.invalidAutCodeMessage = '';

		vm.flagAccountLockMessage = false;
		vm.accountLockMessage = '';

		//api call handle from UI
		vm.verifyAuthCode = verifyAuthCode;
		vm.onResendUniqueCode = onResendUniqueCode;
		vm.verifyByPhone = verifyByPhone;
		vm.verifyByEmail = verifyByEmail;

		getSecondary2faConfigInformation();

		$scope.$on(localeService.textLoadedEventName, createUniqueCodeFormFields);
		$scope.$on(localeService.textLoadedEventName, verifyOptionsFields);
		$scope.$on(localeService.textLoadedEventName, createSecondarySecurityFields);

		activate();

		function activate() {
			createUniqueCodeFormFields();
			createSecondarySecurityFields();
			logger.info('Activated Wallet Verify User Authentication Page.');
		}

		/**
		 * @function getSecondary2faConfigInformation
		 * @description This function will be used and fetch the  value from the tenant portal configuration and
		 * according to that display the secondary security input filed if tenant portal configure = NONE then only
		 * the uniqueCode screen input will be displayed.
		 */
		// TODO: Remove this function getSecondary2faConfigInformation when tenant configure value getting runtime
		function getSecondary2faConfigInformation() {

			if (app.config.secondary2faConfig === 'CARDLAST4DIGIT') {
				vm.secondary2faConfigLabel = app.text.tenantPortalConfigCardLabel;
				vm.secondary2faConfigPlaceHolder = app.text.tenantPortalConfigCardPlaceHolder;
				vm.secondary2faConfigMessage = app.text.tenantPortalConfigCardMessage;
			}
			else if (app.config.secondary2faConfig === 'NATIONALID') {
				vm.secondary2faConfigLabel = app.text.tenantPortalConfigNationalIDLabel;
				vm.secondary2faConfigPlaceHolder = app.text.tenantPortalConfigNationalIDPlaceHolder;
				vm.secondary2faConfigMessage = app.text.tenantPortalConfigNationalIDMessage;
			}
			else if (app.config.secondary2faConfig === 'POSTALCODE') {
				vm.secondary2faConfigLabel = app.text.tenantPortalConfigPostalLabel;
				vm.secondary2faConfigPlaceHolder = app.text.tenantPortalConfigPostalPlaceHolder;
				vm.secondary2faConfigMessage = app.text.tenantPortalConfigPostalMessage;
			}
			else if (app.config.secondary2faConfig === 'CARDEXPIRYDATE') {
				vm.secondary2faConfigLabel = app.text.tenantPortalConfigCardExpiryLabel;
				vm.secondary2faConfigPlaceHolder = app.text.tenantPortalConfigCardExpiryPlaceHolder;
				vm.secondary2faConfigMessage = app.text.tenantPortalConfigCardExpiryMessage;
			}
		}

		/**
		 * @function verifyAuthCodeRequest
		 * @description This function will verify auth code based on the userSignType if PHONE OR EMAIL ,and
		 * according to passing the parameter for the verifyauthcode API
		 */
		function verifyAuthCodeRequest() {
			var verifyAuthCodeRequest;
			if (vm.userSignInType === 'PHONE') {
				verifyAuthCodeRequest = {
					category: 'RESET_PASSWORD',
					authCode: vm.verifyAuthModel.uniqueCode,
					PhoneNumber: vm.userSignInValue,
					accountVerifier: {
						type: app.config.secondary2faConfig,
						value: vm.verifySecondarySecurityModel.secondarySecurity
					}
				};
			}
			else if (vm.userSignInType === 'EMAIL') {
				verifyAuthCodeRequest = {
					category: 'RESET_PASSWORD',
					authCode: vm.verifyAuthModel.uniqueCode,
					emailAddress: vm.userSignInValue,
					accountVerifier: {
						type: app.config.secondary2faConfig,
						value: vm.verifySecondarySecurityModel.secondarySecurity
					}
				};
			}
			return verifyAuthCodeRequest;
		}

		/**
		 * @function verifyAuthCode
		 * @description This function will verify auth code
		 * and if authcode is success then flow will continue on new password  Page.
		 */
		function verifyAuthCode() {

			//api request for verifyAuthCodeForVerifyForgotPassword to wallet server
			api.request('verifyAuthCodeForVerifyForgotPassword', verifyAuthCodeRequest())
				.then(verifyAuthCodeSuccess, verifyAuthCodeFail);

			function verifyAuthCodeSuccess(response) {
				vm.uniqueCodeErrorMessage = '';

				if (response.errors) {
					handleErrors(response.errors);
				}
				else if (response.success === true || response.success === 'true') {
					flowstack.add('resetForgotPassword');
					flowstack.next();
					logger.info('Move to Reset Forgot Password Screen Successfully');
				}
			}

			function verifyAuthCodeFail() {
				logger.error('You have entered an invalid Unique Code, please try again');
			}

			/**
			 * @function handleErrors
			 * @description After verify auth code, it will check for error code from wallet server.
			 * {reasonCode} EXCEED_RETRY_FOR_AUTHCODE : You've entered the wrong information too many time.
			 */
			function handleErrors(errors) {
				var errorCodes = _.pluck(errors, 'reasonCode');
				if (errorCodes.indexOf('EXCEED_RETRY_FOR_AUTHCODE') !== -1) {
					vm.flagAccountLockMessage = true;
					vm.accountLockMessage = errors[0].description;
					vm.verifySecondarySecurityModel.secondarySecurity = '';
					vm.verifyAuthModel.uniqueCode = '';
					logger.info(errors[0].description);
				}
				else {
					vm.flagInvalidAutCodeMessage = true;
					vm.invalidAutCodeMessage = errors[0].description;
					vm.options.resetModel();
					vm.secondaryOptions.resetModel();
					logger.info(errors[0].description);
				}

			}
		}

		/**
		 * @function resetSelections and resetAuthModel
		 * @description Reset the formly model selections for the validations.
		 */
		function resetSelections() {
			vm.showVerifyAuthForm = false;
			vm.isVerifyByEmail = false;
			vm.isVerifyByPhone = false;
			resetAuthModel();
			verifyOptionsFields();
		}

		function resetAuthModel() {
			vm.options.resetModel();
			vm.uniqueCodeErrorMessage = '';
			vm.flagInvalidAutCodeMessage = false;
			vm.invalidAutCodeMessage = '';
			vm.flagInvalidAutCodeMessage = false;
			vm.flagAccountLockMessage = false;
		}

		/**
		 * @function verifyByPhone
		 * @description Based on tenant portal configuration this will call onResendUniqueCode() function and call the
		 * server side API,and according to the userSign display the formly form with phoneNumber or Email textInput.
		 */
		function verifyByPhone() {
			resetSelections();
			if (app.config.primaryConfigOTP === 'SMS') {
				onResendUniqueCode();
			}
			else {
				if (vm.userSignInType === 'EMAIL') {
					vm.isVerifyByPhone = true;
					vm.buttonText = app.text.verifyEmailButtonText;
					vm.verifyOptionsFormDescription = app.text.verifyPhoneDescription;
				}
				else {
					vm.isVerifyByEmail = true;
					vm.buttonText = app.text.verifyPhoneButtonText;
					vm.verifyOptionsFormDescription = app.text.verifyEmailDescription;
				}
				vm.showVerifyAuthForm = true;
			}
		}

		/**
		 * @function verifyByEmail
		 * @description Based on tenant portal configuration this will call onResendUniqueCode() function and call the
		 * server side API,and according to the userSign display the formly form with phoneNumber or Email textInput.
		 */
		function verifyByEmail() {
			resetSelections();
			if (app.config.primaryConfigOTP === 'EMAIL') {
				//vm.isVerifyByEmail = true;
				onResendUniqueCode();
			}
			else {
				if (vm.userSignInType === 'EMAIL') {
					vm.isVerifyByPhone = true;
					vm.buttonText = app.text.verifyEmailButtonText;
					vm.verifyOptionsFormDescription = app.text.verifyPhoneDescription;
				}
				else {
					vm.isVerifyByEmail = true;
					vm.buttonText = app.text.verifyPhoneButtonText;
					vm.verifyOptionsFormDescription = app.text.verifyEmailDescription;
				}
				vm.showVerifyAuthForm = true;
			}
		}

		/**
		 * @function createResendAuthCodeRequest
		 * @description Request parameter decided here for the onResendUniqueCode function and one of the parameter
		 * will be passed to function specified onResendUniqueCode.
		 */
		function createResendAuthCodeRequest() {
			var resendAuthCodeRequest;
			var resendAuthCodeRequestTenantConfig;
			if (vm.isVerifyByPhone) {
				resendAuthCodeRequest = {
					channel: app.config.primaryConfigOTP,
					emailPhoneVerifier: {
						type: 'PHONE',
						value: 'US+1' + vm.verifyOption.phoneNumber
					},
					category: 'RESET_PASSWORD',
					emailAddress: vm.userSignInValue

				};
			}
			else if (vm.isVerifyByEmail) {
				resendAuthCodeRequest = {
					channel: app.config.primaryConfigOTP,
					emailPhoneVerifier: {
						type: 'EMAIL',
						value: vm.verifyOptionsForm.email.$viewValue
					},
					category: 'RESET_PASSWORD',
					mobilePhone: {
						countryCode: 'US+1',
						phoneNumber: vm.userSignInValue
					}
				};

			}

			if (vm.userSignInType === 'EMAIL') {
				resendAuthCodeRequestTenantConfig = {
					channel: app.config.primaryConfigOTP,
					category: 'RESET_PASSWORD',
					emailAddress: vm.userSignInValue
				};

			} else if (vm.userSignInType === 'PHONE') {
				resendAuthCodeRequestTenantConfig = {
					channel: app.config.primaryConfigOTP,
					category: 'RESET_PASSWORD',
					phoneNumber: vm.userSignInValue
				};
			}

			if (vm.isVerifyByPhone || vm.isVerifyByEmail) {
				return resendAuthCodeRequest;
			}
			else {
				return resendAuthCodeRequestTenantConfig;
			}
		}

		/**
		 * @function onResendUniqueCode
		 * @description This function will be used to resend the auth code using PhoneNumber or Email as per the user
		 * input .
		 * {resendAuthCodeSuccess} Resend auth code generated successfully on Phone or Email.
		 * {resendAuthCodeFail} Based on the server side response display the error messages with the reason code.
		 */
		function onResendUniqueCode() {

			//api request for resendAuthCode to wallet server
			api.request('resendAuthCodeForVerifyForgotPassword', createResendAuthCodeRequest())
				.then(resendAuthCodeSuccess, resendAuthCodeFail);

			function resendAuthCodeSuccess(response) {
				if (response.errors) {
					handleResendAuthCodeErrors(response.errors);
				}
				else {
					if (response.success === true || response.success === 'true') {
						logger.info('Move to Reset Forgot Password Screen Successfully');
					}
				}
			}

			function resendAuthCodeFail() {
				logger.error('You have entered an invalid Unique Code, please try again');
			}

			/**
			 * @function handleResendAuthCodeErrors
			 * @description After verify & resend auth code, it will check for error code from wallet server.
			 */
			function handleResendAuthCodeErrors(errors) {
				var errorCodes = _.pluck(errors, 'reasonCode');
				if (errorCodes.indexOf('UNSPECIFIED_ERROR') !== -1 || errorCodes.indexOf('SYSTEM_ERROR') !== -1) {
					flowstack.add('signin');
					flowstack.next();
					logger.info('Internal Server Error');
				}
				else {
					vm.flagInvalidAutCodeMessage = true;
					vm.invalidAutCodeMessage = errors[0].description;
					vm.options.resetModel();
					vm.secondaryOptions.resetModel();
					logger.info(errors[0].description);
				}

			}
		}

		/**
		 * @function verifyOptionsFields
		 * @description This function will assign form fields to Verify user authenticate formly form.
		 * We can add new fields here as per requirement.
		 */
		function verifyOptionsFields() {
			vm.verifyOptionsFields = [
				{
					className: 'row',
					fieldGroup: [
						{
							key: 'phoneNumber',
							name: 'phoneNumber',
							type: 'input',
							className: 'col-sm-12 col-xs-12',
							templateOptions: {
								label: app.text.phoneNumberLabel,
								placeholder: app.text.phoneNumberPlaceholder
							},
							hideExpression: function() {
								return !vm.isVerifyByPhone;
							},
							validators: {
								required: {
									expression: validations.required,
									message: app.text.requiredField
								},
								phoneNumber: {
									expression: validations.phoneDigitValidator,
									message: app.text.verifyPhoneValidatorError
								}
							}
						},
						{
							key: 'email',
							name: 'email',
							type: 'input',
							className: 'col-sm-12 col-xs-12',
							templateOptions: {
								label: app.text.verifyEmailLabel,
								placeholder: app.text.verifyEmailPlaceholder
							},
							hideExpression: function() {
								return !vm.isVerifyByEmail;
							},
							validators: {
								required: {
									expression: validations.required,
									message: app.text.requiredField
								},
								emailAddress: {
									expression: validations.emailValidator,
									message: app.text.verifyEmailValidatorError
								}
							}
						}
					]
				}
			];
		}

		/**
		 * @function createUniqueCodeFormFields
		 * @description This will assign form fields for verify & authenticate user
		 * formly form. We can add new fields here as per requirement.
		 */

		function createUniqueCodeFormFields() {
			vm.uniqueCodefields = [
				{
					className: 'row',
					fieldGroup: [
						{
							key: 'uniqueCode',
							name: 'uniqueCode',
							type: 'input',
							className: 'col-sm-12 col-xs-12',
							templateOptions: {
								label: app.text.uniqueCodeText,
								placeholder: app.text.uniqueCodePlaceHolder,
								onKeyup: function($viewValue) {
									if ($viewValue !== undefined && $viewValue.length > 0) {
										vm.secondarySecurityTxtIpt = false;
										createSecondarySecurityFields();
									} else {
										vm.secondarySecurityTxtIpt = true;
										vm.verifySecondarySecurityModel.secondarySecurity = '';
										createSecondarySecurityFields();
									}
								},
								onFocus: function() {
									vm.flagInvalidAutCodeMessage = false;
									vm.flagAccountLockMessage = false;
								}
							},
							validators: {
								required: {
									expression: validations.required,
									message: app.text.uniqueCodeValidation
								}
							}
						}
					]
				}
			];
		}

		/**
		 * @function createUniqueCodeFormFields
		 * @description This will assign form fields for verify & authenticate user
		 * formly form. We can add new fields here as per requirement.
		 */
		function createSecondarySecurityFields() {
			vm.secondarySecurityfields = [
				{
					className: 'row',
					fieldGroup: [
						{
							key: 'secondarySecurity',
							name: 'secondarySecurity',
							type: 'input',
							className: 'col-sm-12 col-xs-12',
							templateOptions: {
								label: vm.secondary2faConfigLabel,
								placeholder: vm.secondary2faConfigPlaceHolder,
								disabled: vm.secondarySecurityTxtIpt,
								onFocus: function() {
									vm.flagInvalidAutCodeMessage = false;
									vm.secondarySecurityTxtIpt = false;
									vm.flagAccountLockMessage = false;
								}
							},
							validators: {
								required: {
									expression: validations.required,
									message: vm.secondary2faConfigMessage
								}
							}
						}
					]
				}
			];
		}

	}

})();
