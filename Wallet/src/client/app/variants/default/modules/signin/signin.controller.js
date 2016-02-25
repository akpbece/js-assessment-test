/**
 * @module Sign In
 * @description This module will manage wallet sign in.
 */
(function() {
	'use strict';

	angular
		.module('signin')
		.controller('SigninController', SigninController);

	/* @ngInject */
	function SigninController(logger, $scope, api, validations, localeService, session, flowstack) {
		// jshint validthis: true
		var vm = this;
		var app = $scope.app;
		var username = session.get('username');

		vm.submitted = false;
		vm.title = 'Sign In';
		//accountLocked global variable change formly validation field  message shown on AUTH_ACCOUNT_LOCKED condition
		vm.accountLocked = false;

		vm.signin = signin;
		vm.forgotPasswordLinkClick = forgotPasswordLinkClick;

		//TODO vm.user to be removed after integration with switch
		vm.user = {
			rememberMe: true
		};

		$scope.$on(localeService.textLoadedEventName, createFormFields); // ? TODO make this part of activate?

		activate();

		/////////////////

		function activate() {
			setInitialFormData();
			createFormFields();
			logger.info('Activated the Signin View.');
		}

		// TODO: extract to a utility service when we have one.
		// TODO: this needs to have nationalId eventually.
		/**
		 * @function getUserNameType
		 * @description This function is used for identifying username type in Singin Module.
		 * @param {String} userName
		 */
		function getUserNameType(userName) {
			return (userName.indexOf('@') > -1) ? 'emailAddress' : 'phoneNumber';
		}

		// TODO Below "vm.user" data will needs to refactor once deviceFingerprint will identified from mcdev
		// deviceFingerprint : MCBase64Encode.encode(add_deviceprint());

		/**
		 * @function createLoginRequest
		 * @description This function is identifying request for Singin Module.
		 * @param {String} userNameType
		 * @param {String} userName
		 */
		function createLoginRequest(userNameType, userName) {
			// TODO: vm.user to be removed after integration with switch
			if (userNameType === 'emailAddress') {
				session.set('userSignedWith', 'Email');
				return {
					emailAddress: userName,
					deviceFingerprint: null,
					password: vm.user.password
				};
			} else {
				session.set('userSignedWith', 'PhoneNumber');
				return {
					mobilePhone: {
						phoneNumber: userName,
						countryCode: 'US+1'
					},
					deviceFingerprint: null,
					password: vm.user.password
				};
			}
		}

		/**
		 * @function login
		 * @description In case of valid form submission, this function will
		 * submit user login data via sign in API
		 */
		function signin() {
			vm.submitted = false;
			var userName = vm.user.username;
			var userNameType = getUserNameType(userName);

			// api request for validate login to wallet server
			api.request('login', createLoginRequest(userNameType, userName))
				.then(loginSuccess, loginFailure);

			/**
			 * @function loginSuccess
			 * @description In case of successful response from server show the Lockout message description
			 * {reasonCode} AUTH_UNSPECIFIED_LOGIN_ERROR : Sorry, we couldn’t recognize you. Please try again.
			 * {reasonCode} AUTH_ACCOUNT_LOCKED : We’re sorry, but we’re unable to verify your identity and your
			 * account has been temporarily locked.
			 * {reasonCode} AUTH_CONSUMER_SUSPENDED : Your wallet is suspended. Please contact customer care.
			 */
			function loginSuccess(response) {
				// To avoid function's cyclomatic complexity
				/*jshint -W074*/
				if (response.errors !== null && response.errors !== undefined) {
					if (response.errors[0].reasonCode === 'AUTH_UNSPECIFIED_LOGIN_ERROR' ||
						response.errors[0].reasonCode === 'UNSPECIFIED_ERROR') {
						logger.info(response.errors[0].description);
						vm.userAccountLocked = false;
						vm.userAccountSuspsnded = false;
						vm.options.resetModel();
					}
					else if (response.errors[0].reasonCode === 'AUTH_ACCOUNT_LOCKED') {
						vm.userAccountLocked = true;
						vm.user.password = '';
						// accountLocked enable field error message
						vm.accountLocked = true;
					}
					else if (response.errors[0].reasonCode === 'AUTH_CONSUMER_SUSPENDED') {
						vm.options.resetModel();
						vm.userAccountSuspsnded = true;
					} else if (response.errors[0].reasonCode === 'OTP_AUTH_CHALLENGE_REQUIRED') {
						checkOnPrimaryConfigFor2Fa();
					}
				}
				else {
					if (response.loginResponse.success === true || response.loginResponse.success === 'true') {
						checkOnPrimaryConfigFor2Fa();
					}
					//TODO: will refactor in another task, for now get the profile here...
					api.request('getProfile').
						then(getProfileSuccess, getProfileFailure);

					handleTermsConditionFlow();
				}
			}

			function loginFailure(loginError) {
				logger.error('login failed', loginError);
			}

		}

		/**
		 * @function checkOnPrimaryConfigFor2Fa
		 * @description this function will check whether 2FA configured or not AND also check for update legaldoc
		 */
		function checkOnPrimaryConfigFor2Fa() {
			if (app.config.primaryConfigOTP === 'SMS' || app.config.primaryConfigOTP === 'EMAIL') {
				stepUpAuthenticationFlow();
			} else {
				handleTermsConditionFlow();
			}
		}

		/**
		 * @function stepUpAuthenticationFlow
		 * @description This will navigate to 2FA flow
		 */
		function stepUpAuthenticationFlow() {
			flowstack.add('verifyUserAuth');
			flowstack.next();
		}

		function getProfileSuccess(data) {
			logger.info('Profile received ...');
			session.set('profile', data);
		}

		function getProfileFailure(error) {
			logger.error('Get Profile Failed with : ', error);
			// TODO - do error logic when we have it.
		}

		/**
		 * @function handleTermsConditionFlow
		 * @description This will verify retrievePaymentCard api after login success api response which will used to
		 * navigate flow to terms and condition for re-acceptance.
		 */
		function handleTermsConditionFlow() {
			function retrievePaymentCardSuccess(response) {
				vm.termsResult = response;
				if (vm.termsResult !== undefined && vm.termsResult != null && vm.termsResult.errors !== undefined) {
					var strReasonCode = vm.termsResult.errors[0].reasonCode;
					var arrReasonCode = strReasonCode.split('-');
					switch (arrReasonCode[1]) {
						case 'TP':
						case 'T':
						case 'P':
							onResponseReasonCodeHandler();
							break;
						default:
							vm.user = {};
							vm.options.resetModel();
							break;
					}
				} else if (vm.termsResult.paymentCards !== undefined) {
					flowstack.next();
				}
			}

			function retrievePaymentCardFailure(retrievePaymentCardError) {
				logger.error('retrieve payment card failed', retrievePaymentCardError);
			}

			function onResponseReasonCodeHandler() {
				flowstack.add('terms');
				flowstack.next();
			}

			// api request to get retrievePaymentCard from wallet server
			api.request('retrievePaymentCard')
				.then(retrievePaymentCardSuccess, retrievePaymentCardFailure);
		}

		function passSoftLockValidation($viewValue) {
			if ($viewValue) {
				return true;
			}
			return !vm.accountLocked;
		}

		/**
		 * @function setInitialFormData
		 * @description sets the initial form data specific to this page
		 * if that data is available, in this case for now its:
		 *  username: (username or email can come from switch)
		 * */
		function setInitialFormData() {
			vm.user.username = username; // it is undefined by default in session.
		}

		/**
		 * @function focusPasswordField
		 * @description looks to see if we have a username in session, if so
		 * return a boolean that we can use to focus the password field in the form.
		 * */
		function focusPasswordField() {
			return !!username;
		}

		/**
		 * @function forgotPasswordLinkClick
		 * @description This will navigate to forgotPassword flow
		 */
		function forgotPasswordLinkClick() {
			flowstack.add('forgotPassword');
			flowstack.next();
		}

		/**
		 * @function createFormFields
		 * @description This will assign form fields for Sign In
		 * formly form. We can add new fields here as per requirement.
		 */
		function createFormFields() {
			vm.fields = [
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
								focus: !focusPasswordField(),
								disabled: focusPasswordField()
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
				},
				{
					template: '<label>' + app.text.passwordLabel + '</label>'
				},
				{
					fieldGroup: [
						{
							key: 'password',
							name: 'password',
							type: 'passwordWithInfoField',
							templateOptions: {
								placeholder: app.text.passwordPlaceholder,
								focus: focusPasswordField()
							},
							validators: {
								required: {
									expression: validations.required,
									message: app.text.requiredField
								},
								passwordSoftLock: {
									expression: passSoftLockValidation,
									message: app.text.passwordSoftLock
								}
							}
						}
					]
				},
				{
					fieldGroup: [
						{
							className: 'col-sm-6 col-xs-6',
							key: 'rememberMe',
							name: 'rememberMe',
							type: 'rememberMeWithLearnMore',
							templateOptions: {
								rememberMeLabel: app.text.rememberMeLabel,
								learnMoreLabel: app.text.learnMoreLabel
							}
						}
					]
				}
			];
		}
	}
})();
