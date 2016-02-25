/**
 * @module verifyUserAuth
 * @description This module will Authenticate User after successful Sign in.
 * @story S13661 - [F777] Wallet: Generate OTP for 2FA after successful sign in
 * @storyLink https://rally1.rallydev.com/#/48620050247d/detail/userstory/49997413191
 * @story S13662 - [F777] Wallet: Create Service to verify OTP for 2FA
 * @storyLink https://rally1.rallydev.com/#/48620050247d/detail/userstory/49997416224
 * @story S13663 - [F777] Wallet: Create Service to resend OTP for 2FA via SMS
 * @storyLink https://rally1.rallydev.com/#/48620050247d/detail/userstory/49997592379
 * @story S13664 - [F777] Wallet: Create Service to resend OTP for 2FA via Email
 * @storyLink https://rally1.rallydev.com/#/48620050247d/detail/userstory/49997595509
 */
(function() {
	'use strict';

	angular
		.module('verifyUserAuth')
		.controller('VerifyUserAuthController', VerifyUserAuthController);

	/* @ngInject */
	function VerifyUserAuthController($scope, api, flowstack, validations, session, logger, localeService) {
		/* jshint validthis: true */
		var vm = this;
		var app = $scope.app;

		//Variables used to integrate with UI
		vm.userSignedWith = session.get('userSignedWith');
		vm.countUniqueCodeSoftLock = false;
		vm.countUniqueCodeSuspended = false;
		vm.uniqueCodeErrorMessage = '';

		//api call handle from UI
		vm.verifyAuthCode = verifyAuthCode;
		vm.onResendUniqueCode = onResendUniqueCode;
		vm.verifyByPhone = verifyByPhone;
		vm.verifyByEmail = verifyByEmail;

		$scope.$on(localeService.textLoadedEventName, createUniqueCodeFormFields);
		$scope.$on(localeService.textLoadedEventName, verifyOptionsFields);

		activate();

		//////////////////////

		function activate() {
			createUniqueCodeFormFields();
			generateUniqueUserAuthCode();
			logger.info('Activated Wallet Verify User Authentication Page.');
		}

		/**
		 * @function generateUniqueUserAuthCode
		 * @description This function will generate authentication code
		 */
		function generateUniqueUserAuthCode() {
			var generateAuthCodeRequest = {
				'category': 'LOGIN_2FA'
			};

			//api request for generateAuthCode to wallet server
			api.request('generateAuthCode', generateAuthCodeRequest)
				.then(generateAuthCodeSuccess, generateAuthCodeFail);

			function generateAuthCodeSuccess() {
				logger.info('Your unique code generated :: ' + vm.randomnumber);
			}

			function generateAuthCodeFail() {
				logger.error('Your Unique Code is invalid, please try again');
			}
		}

		/**
		 * @function verifyAuthCode
		 * @description This function will verify auth code
		 * and if authcode is success then flow will continue on TnC OR verifyPayment Page.
		 */
		function verifyAuthCode() {

			var verifyAuthCodeRequest = {
				category: 'LOGIN_2FA',
				authCode: vm.verifyAuthModel.uniqueCode
			};

			api.request('verifyAuthCode', verifyAuthCodeRequest)
				.then(verifyAuthCodeSuccess, verifyAuthCodeFail);

			function verifyAuthCodeSuccess(response) {
				vm.uniqueCodeErrorMessage = '';
				if (response.errors) {
					handleErrors(response.errors);
				}
				else {
					logger.info('OTP code verify successfully');
					if (response.success === true || response.success === 'true') {
						termsConditionFlow();
					}
				}
			}

			function verifyAuthCodeFail() {
				logger.error('You have entered an invalid Unique Code, please try again');
			}

			/**
			 * @function handleErrors
			 * @description After verify auth code, it will check for error code from wallet server.
			 * {reasonCode} EXCEED_RETRY_FOR_AUTHCODE : You've entered the wrong information too many time.
			 * You may want to request a new code before trying again.
			 * {reasonCode} AUTH_CONSUMER_SUSPENDED : Your wallet is suspended. Please contact customer care.
			 * {reasonCode} INVALID_AUTHCODE : Your Unique Code is invalid, please try again.
			 * {reasonCode} AUTH_CODE_EXPIRED : You've entered an invalid unique code. Please try again.
			 */
			function handleErrors(errors) {
				var errorCodes = _.pluck(errors, 'reasonCode');
				if (errorCodes.indexOf('UNSPECIFIED_ERROR') !== -1) {
					//resetting flow to signin page
					flowstack.add('signin');
					flowstack.next();
				}
				else if (errorCodes.indexOf('EXCEED_RETRY_FOR_AUTHCODE') !== -1) {
					vm.countUniqueCodeSoftLock = true;
					vm.options.resetModel();
					logger.info('Your account is soft locked');
				}
				else if (errorCodes.indexOf('AUTH_CONSUMER_SUSPENDED') !== -1) {
					vm.countUniqueCodeSuspended = true;
					vm.options.resetModel();
					logger.info('Your account is Suspended');
				}
				else if (errorCodes.indexOf('INVALID_AUTHCODE') !== -1) {
					vm.uniqueCodeErrorMessage = app.text.wrongUniqueCode;
					vm.options.resetModel();
					logger.info('You have entered Wrong OTP');
				}
				else if (errorCodes.indexOf('AUTH_CODE_EXPIRED') !== -1) {
					vm.uniqueCodeErrorMessage = app.text.uniqueCodeVerifyAfterTimeOut;
					vm.options.resetModel();
					logger.info('Your OTP expired');
				}
			}
		}

		/**
		 * @function termsConditionFlow
		 * @description This will verify retrievePaymentCard api response to validate
		 * updateLegalDocs changed from tenant portal or not
		 */
		function termsConditionFlow() {
			//api request for retrievePaymentCard to wallet server
			api.request('retrievePaymentCard')
				.then(termsConditionSuccess, termsConditionFail);

			function termsConditionSuccess(response) {
				var termsResult = response;

				if (termsResult !== undefined && termsResult != null) {
					if (termsResult.errors !== undefined) {
						var strResonCode = termsResult.errors[0].reasonCode;
						var arrReasonCode = strResonCode.split('-');
						switch (arrReasonCode[1]) {
							case 'TP':
							case 'T':
							case 'P':
								onResponseReasonCodeHandler();
								break;
							default:
								flowstack.add('verifyPayment');
								flowstack.next();
						}
					} else if (termsResult.paymentCards !== undefined) {
						logger.info('Inside VerifyPayment Call');
						flowstack.add('verifyPayment');
						flowstack.next();
					}

				}
				// TODO removed once integrate with dev
				if (termsResult.paymentCards !== undefined) {
					logger.info('Inside VerifyPayment Main');
					flowstack.add('verifyPayment');
					flowstack.next();
				}
			}

			function termsConditionFail() {
				logger.error('termsConditionFail failed ');
			}

			function onResponseReasonCodeHandler() {
				flowstack.add('terms');
				flowstack.next();
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
			// resetting model on 2FA Authenticate
			vm.options.resetModel();
			vm.uniqueCodeErrorMessage = '';
			vm.countUniqueCodeSoftLock = false;
			vm.countUniqueCodeSuspended = false;
		}

		/**
		 * @function verifyByPhone
		 * @description Based on tenant portal configuration this will call onResendUniqueCode() function and call the
		 * server side API,and according to the userSign display the formly form with phoneNumber or Email textInput.
		 */
		function verifyByPhone() {
			resetSelections();
			if (app.config.primaryConfigOTP === 'SMS') {
				//vm.isVerifyByPhone = true;
				onResendUniqueCode();

			}
			else {
				if (vm.userSignedWith === 'Email') {
					vm.isVerifyByPhone = true;
					vm.buttonText = app.text.verifyPhoneButtonText;

				}
				else {
					vm.isVerifyByEmail = true;
					vm.buttonText = app.text.verifyEmailButtonText;

				}
				// To show verify auth form
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
				if (vm.userSignedWith === 'Email') {
					vm.isVerifyByPhone = true;
					vm.buttonText = app.text.verifyPhoneButtonText;

				}
				else {
					vm.isVerifyByEmail = true;
					vm.buttonText = app.text.verifyEmailButtonText;

				}
				// To show verify auth form
				vm.showVerifyAuthForm = true;
			}
		}

		/**
		 * @function createResendAuthCodeRequest
		 * @description Request parameter decided here for the onResendUniqueCode() function and one of the parameter
		 * will be passed to function specified onResendUniqueCode().
		 */
		function createResendAuthCodeRequest() {
			var type, value;
			if (vm.isVerifyByEmail) {
				type = 'EMAIL';
				value = vm.verifyOption.email;
				vm.verifyOptionsFormDescription = app.text.verifyEmailDescription;
			}
			else if (vm.isVerifyByPhone) {
				type = 'PHONE';
				value = 'US+1' + vm.verifyOption.phoneNumber;
				vm.verifyOptionsFormDescription = app.text.verifyPhoneDescription;
			}

			var resendAuthCodeRequest = {
				channel: app.config.primaryConfigOTP,
				emailPhoneVerifier: {
					verifyType: type,
					value: value
				},
				category: 'LOGIN_2FA'
			};

			var resendAuthCodeRequestTenantConfig = {
				'channel': app.config.primaryConfigOTP,
				'category': 'LOGIN_2FA'

			};

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
			api.request('resendAuthCode', createResendAuthCodeRequest())
				.then(resendAuthCodeSuccess, resendAuthCodeFail);

			function resendAuthCodeSuccess(response) {
				if (response.errors) {
					handleResendAuthCodeErrors(response.errors);
				}
				else {
					if (response.success === true || response.success === 'true') {
						logger.info('Resend OTP generate successfully');
					}
				}
			}

			function resendAuthCodeFail() {
				logger.error('You have entered an invalid Unique Code, please try again');
			}

			/**
			 * @function handleResendAuthCodeErrors
			 * @description After verify & resend auth code, it will check for error code from wallet server.
			 * {reasonCode} AUTH_CODE_EXPIRED : Your Unique Code is invalid,please try again later.
			 * {reasonCode} INVALID_USER_NAME : Invalid User Name.
			 * {reasonCode} EXCEED_RESEND_FOR_AUTHCODE : Sorry we could not identify your input. Please try again.
			 * {reasonCode} AUTHCODE_NOT_FOUND : Sorry we could not identify your input. Please try again.
			 * {reasonCode} NOTIFICATION_FAILURE : Sorry we could not identify your input. Please try again.
			 * {reasonCode} INVALID_AUTHCODE : Your Unique Code is invalid,please try again later.
			 */
			function handleResendAuthCodeErrors(errors) {
				var errorCodes = _.pluck(errors, 'reasonCode');
				if (errorCodes.indexOf('UNSPECIFIED_ERROR') !== -1) {
					//resetting flow to signin page
					flowstack.add('signin');
					flowstack.next();
				}
				else if (errorCodes.indexOf('AUTH_CODE_EXPIRED') !== -1) {
					vm.uniqueCodeErrorMessage = app.text.wrongResendUniqueCodeTimeOut;
					vm.options.resetModel();
					logger.info('Your Unique Code is invalid,please try again later.');
				}
				else if (errorCodes.indexOf('INVALID_USER_NAME') !== -1) {
					vm.uniqueCodeErrorMessage = app.text.invalidUserName;
					vm.options.resetModel();
					logger.info('Invalid User Name');
				}
				else if (errorCodes.indexOf('EXCEED_RESEND_FOR_AUTHCODE') !== -1) {
					vm.uniqueCodeErrorMessage = app.text.exceedResendUniqueCodeTimeOut;
					vm.options.resetModel();
					logger.info('Sorry we could not identify your input. Please try again.');
				}
				else if (errorCodes.indexOf('AUTHCODE_NOT_FOUND') !== -1) {
					vm.uniqueCodeErrorMessage = app.text.exceedResendUniqueCodeTimeOut;
					vm.options.resetModel();
					logger.info('Sorry we could not identify your input. Please try again.');
				}
				else if (errorCodes.indexOf('NOTIFICATION_FAILURE') !== -1) {
					vm.uniqueCodeErrorMessage = app.text.exceedResendUniqueCodeTimeOut;
					vm.options.resetModel();
					logger.info('Sorry we could not identify your input. Please try again.');
				}
				else if (errorCodes.indexOf('INVALID_AUTHCODE') !== -1) {
					vm.uniqueCodeErrorMessage = app.text.wrongResendUniqueCodeTimeOut;
					vm.options.resetModel();
					logger.info('Your Unique Code is invalid,please try again later.');
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
							className: 'col-sm-12',
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
							className: 'col-sm-12',
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
									expression: validations.emailAddressValidator,
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
							className: 'col-sm-12',
							templateOptions: {
								label: app.text.uniqueCodeText,
								placeholder: app.text.uniqueCodePlaceHolder,
								focus: function() {
									vm.uniqueCodeErrorMessage = '';
									return true;
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
	}
})();
