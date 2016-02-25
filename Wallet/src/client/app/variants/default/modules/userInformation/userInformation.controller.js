(function() {
	'use strict';

	/**
	 * @module controller: userInformation
	 * @description gather user information during account registration at
	 * checkout.	collects address, password and either email/phone and
	 * creates account profile
	 * @story S6397 - Info and Password Entry
	 * @storyLink https://rally1.rallydev.com/#/46772663622d/detail/userstory/46772656342
	 * @story S5406 - Shipping address not supported by merchant
	 * @storyLink https://rally1.rallydev.com/#/46772663622d/detail/userstory/46772690928
	 * @story S8978 - Remaining billing and info page
	 * @storyLink https://rally1.rallydev.com/#/46772663622d/detail/userstory/48201691740
	 */

	angular
		.module('userInformation')
		.controller('UserInformationController', UserInformationController);

	/* @ngInject */
	function UserInformationController(
		$q,
		$scope,
		validations,
		logger,
		api,
		session,
		flowstack,
		localeService,
		$stateParams
	) {
		var vm = this;
		var app = $scope.app;
		var countryCode = session.get('locale').split('-')[1].toUpperCase();
		var countrySubDivisions = [];
		var allowedShipToCountries = session.get('merchant.allowedShipToCountries');
		var suppressShippingAddress = (session.get('merchant.suppressShippingAddress') === 'true');
		var hidePhoneNumberFields = (session.get('usernameType') === 'phone'); // fixme : candidate for flow param
		var isPrimaryAddress = false;

		vm.submitted = false;
		vm.submit = submit;
		vm.title = 'User Information';
		vm.lastFourPAN = session.get('registrationDataFromSwitch').paymentCard.accountNumber.slice(-4);

		/*
		 * If "$stateParams" have a "duplicate" key in it then its
		 * a "duplicate credential found" case. Value of $stateParams.duplicate
		 * may be "email" or "phone".
		 */
		vm.isDuplicateCredentialFound = Boolean($stateParams.duplicate);

		if (vm.isDuplicateCredentialFound) {
			vm.duplicateCredential = {
				type: $stateParams.duplicate,
				validationTriggered: false
			};
		}

		/*
		 * Handling back button functionality from Shipping Address.
		 * When consumer comes back from Shipping Address screen to Billing Info. & Password screen then
		 * profile data should be pre-populated which consumer has already filled previously.
		 */
		vm.profile = session.get('form.userInformation') || {
				contactDetails: {
					mobilePhone: {
						countryCode: 'US+1' // TODO: dont hard code this
					}
				},
				paymentCard: {
					address: {
						country: countryCode
					},
					useBillingAddressAsShippingAddress: true
				},
				shippingAddress: null
			};

		$scope.$on(localeService.textLoadedEventName, createFormFields); // ? TODO make this part of activate?

		activate();

		//////////////

		function activate() {
			var promises = [getCountrySubDivisions(countryCode)];
			return $q.all(promises).then(function() {
				setModelDataFromSwitchSignupPage();
				createFormFields();
				logger.info('Activated the User Information View.');
			});
		}

		/**
		 * @function submit
		 * @description Create user profile when form is submitted
		 */
		function submit() {
			// These are all sync requests for now, as these calls are
			// temporary to enable registration for checkout and login.
			//
			// The API to create new accounts is likely to change to
			// aggregate both profile creation and add card in a single call.
			vm.submitted = false;

			function profileSuccess(profileData) {
				// save payment card legacy call
				var paymentCardRequest = createLegacyPaymentCardRequest();

				// TODO: move generic error checking out into api component to get proper resolve/reject
				if (profileData.errors) {
					logger.error('profile creation failed', profileData.errors);

					// Keep profile data in session so that we can pre populate
					// User Information form with userfield data, when we come
					// to this screen from "registrationCollision" screen
					session.set('form.userInformation', vm.profile);
					var errors = profileData.errors;
					var errorCodes = _.pluck(errors, 'reasonCode');
					if (errorCodes.indexOf('INVALID_EMAIL') !== -1) {
						flowstack.add('registrationCollision');
						flowstack.next({
							secondaryCredentialType: 'email'
						});
					}
					else if (errorCodes.indexOf('INVALID_MOBILE') !== -1) {
						flowstack.add('registrationCollision');
						flowstack.next({
							secondaryCredentialType: 'phone'
						});
					}
				} else {
					// create profile success

					// we store the entire profile, because on registrationConfirmation we need to post the whole thing
					// back up with any changes for the email optin and remember me checkboxes
					session.set('profile', profileData);
					api.request('savePaymentCard', paymentCardRequest)
						.then(paymentCardSuccess, paymentCardFailure);
				}

			}

			function profileFailure(err) {
				// scary scary failure
				logger.error('profile creation error', err);
			}

			function paymentCardSuccess(paymentCardData) {
				if (!paymentCardData.addPaymentCardResponse) {
					logger.error('no addPaymentCardResponse returned from save payment card', paymentCardData);
					return;
				}

				// create payment card success
				// TODO: add what we need to here as time goes on.
				session.set('paymentCard.id', paymentCardData.addPaymentCardResponse.paymentCard.id);

				// FIXME: we need to delete the PAN here after creating an payment card
				// session.remove('registrationDataFromSwitch');
				// See if we need to use billing as shipping, if so go to shipping
				if (!vm.profile.paymentCard.useBillingAddressAsShippingAddress) {
					session.set('profile.billingAddress', vm.profile.paymentCard.address);
					flowstack.next();
				} else if (!suppressShippingAddress && !_.includes(allowedShipToCountries, countryCode)) {
					// if Suppress Shipping Address is false and
					// Merchant does not supporting shipping country (Current Country),
					// then shipping address screen should be opened with Sorry Message.
					// by setting shippingAddressNotSupported
					session.set('profile.billingAddress', vm.profile.paymentCard.address);
					flowstack.next({
						shippingAddressNotSupported: true
					});
				} else {
					// remove temporary session variable
					session.remove('form.userInformation');
					// If consumer has checked use billing as shipping
					// and merchant is supporting shipping country
					// then Only Billing address will be primary address
					isPrimaryAddress = true;
				}

				// save shipping address Legacy call with profile
				api.request('saveShippingDestination', createLegacyShippingAddressRequest())
					.then(shippingAddressSuccess, shippingAddressFailure);
			}

			function paymentCardFailure(paymentCardError) {
				// TODO: handle payment card failure - may get aggregated with profile creation in new API
				logger.error('add paymentcard failed', paymentCardError);
			}

			function shippingAddressSuccess(shippingAddressData) {
				if (!shippingAddressData.shippingDestination) {
					logger.error('no shippingAddressData returned from save shipping address', shippingAddressData);
					return;
				}

				// If consumer's address is primary address then
				// skip shipping address screen and directly
				// go to congratulations screen.
				if (isPrimaryAddress) {
					// TODO: add what we need to here as time goes on.
					// TODO: not use session when we have something else to pass variables like this around for flows and UI conditionals.
					session.set('shippingDestination.id', shippingAddressData.shippingDestination.id);
					session.set('flow.skipShippingAddress', true);
					flowstack.next();
				}
			}

			function shippingAddressFailure(shippingAddressError) {
				logger.error('add shipping address failed', shippingAddressError);
			}

			api.request('createProfile', createLegacyProfileRequest())
				.then(profileSuccess, profileFailure);
		}

		/**
		 * @function createLegacyShippingAddressRequest
		 * @description call the legacy shipping destination with its requirements
		 * */
		function createLegacyShippingAddressRequest() {
			var address = vm.profile.paymentCard.address;
			var countrySubdivision = address.countrySubdivision.split('-')[1];

			var request = {
				recipientName: vm.profile.contactDetails.name.first + ' ' + vm.profile.contactDetails.name.last,
				address: {
					country: countryCode,
					countrySubdivision: countrySubdivision,
					line1: address.line1,
					city: address.city,
					postalCode: address.postalCode
				},
				phoneNumber: {
					countryCode: vm.profile.contactDetails.mobilePhone.countryCode,
					phoneNumber: vm.profile.contactDetails.mobilePhone.phoneNumber
				},
				preferred: isPrimaryAddress
			};

			return request;
		}

		/**
		 * @function createLegacyProfileRequest
		 * @description call the legacy profile with the legacy requirements
		 * */
		function createLegacyProfileRequest() {
			var contactDetails = vm.profile.contactDetails;

			return {
				emailAddress: contactDetails.emailAddress,
				mobilePhone: {
					countryCode: contactDetails.mobilePhone.countryCode,
					phoneNumber: contactDetails.mobilePhone.phoneNumber
				},
				password: contactDetails.password,
				name: {
					first: contactDetails.name.first,
					last: contactDetails.name.last
				},
				// TODO: can we remove this.  Hardcoded and needed for legacy call.
				securityChallenges: [{
					code: 'Q1.7',
					answer: 'testAnswerRemoveMePlease'
				}],
				preferences: { // set defaults, can get toggled on congratulations page
					receiveEmailNotification: false,
					receiveMobileNotification: false,
					personalizationOptIn: false
				},
				countryOfResidence: countryCode,
				locale: session.get('locale'),
				walletId: session.get('wallet.id'),
				// T&C acceptance is implied by clicking 'Continue'
				termsOfUseAccepted: true,
				cookiePolicyAccepted: true,
				privacyPolicyAccepted: true
			};
		}

		/**
		 * @function createLegacyPaymentCardRequest
		 * @description call the legacy add card service with its requirements
		 * */
		function createLegacyPaymentCardRequest() {
			var switchSignupData = session.get('registrationDataFromSwitch');

			return {
				cardholderName: vm.profile.contactDetails.name.first + ' ' + vm.profile.contactDetails.name.last,
				accountNumber: switchSignupData.paymentCard.accountNumber.toString(),
				securityCode: switchSignupData.paymentCard.securityCode.toString(),
				expiryMonth: switchSignupData.paymentCard.expirationDate.month.toString(),
				expiryYear: switchSignupData.paymentCard.expirationDate.year.toString(),
				cardBrand: {	// TODO: detect card type in Switch, pass it in here
					code: 'master',
					name: 'Mastercard'
				},
				address: {
					country: countryCode,
					line1: vm.profile.paymentCard.address.line1,
					city: vm.profile.paymentCard.address.city
				},
				phoneNumber: {
					countryCode: 'US+1',	// TODO: get this dynamically based on country
					phoneNumber: vm.profile.contactDetails.mobilePhone.phoneNumber
				},
				preferred: true
			};
		}

		/**
		 * @function focusDuplicateCredentialField
		 * @returns {boolean}
		 */
		function focusDuplicateCredentialField() {
			if (vm.isDuplicateCredentialFound && vm.duplicateCredential.type) {
				// if duplicate credential was found, flag that field with error on page load
				if (vm.duplicateCredential.type === 'email') {
					vm.userForm.email.$setTouched();
				}
				else if (vm.duplicateCredential.type === 'phone') {
					vm.userForm.phoneNumber.$setTouched();
				}
				return true;
			}
			return false;
		}

		/**
		 * @function triggerDuplicateCredentialValidation
		 * @returns {boolean}
		 */
		function triggerDuplicateCredentialValidation() {
			if (vm.isDuplicateCredentialFound &&
					!vm.duplicateCredential.validationTriggered) {
				// only trigger the duplicate username validation once on load
				vm.duplicateCredential.validationTriggered = true;
				return false;
			}
			else {
				return true;
			}
		}

		/**
		 * @function setModelDataFromSwitchSignupPage
		 * @description Retrieve username (email or phone value) from Switch registration page
		 */
		function setModelDataFromSwitchSignupPage() {
			var registrationDataFromSwitch = session.get('registrationDataFromSwitch');

			if (registrationDataFromSwitch.usernameType === 'phone') {
				vm.profile.contactDetails.mobilePhone.phoneNumber = registrationDataFromSwitch.username;
			} else if (registrationDataFromSwitch.usernameType === 'email') {
				vm.profile.contactDetails.emailAddress = registrationDataFromSwitch.username;
			} else {
				// else there is no switch data.
				throw new Error('There was a problem getting email or phone from switch');
			}
		}

		/**
		 * @function getCountrySubDivisions
		 * @description Get country division based on the passed country code.
		 * @param {String} countryCode Country code
		 * @returns {Array}
		 */
		function getCountrySubDivisions(countryCode) {
			var defer = $q.defer();
			api.request('countrySubDivision', {countryCode: countryCode})
				.then(success, fail);

			function success(response) {
				countrySubDivisions = response.countrySubdivisions;
				defer.resolve();
			}

			function fail(err) {
				logger.error(err);
				defer.reject(err);
			}

			return defer.promise;
		}

		/**
		 * @function createFormFields
		 * @description This will assign form fields for User Information
		 * formly form. We can add new fields here as per requirement.
		 */
		function createFormFields() {
			vm.fields = [
				{
					className: 'row',
					fieldGroup: [
						{
							className: 'col-sm-6 col-xs-6',
							key: 'contactDetails.name.first',
							name: 'first',
							type: 'input',
							templateOptions: {
								placeholder: app.text.firstNamePlaceholder,
								focus: true
							},
							validators: {
								max: {
									expression: validations.firstNameMaxValidator,
									message: app.text.maxFirstNameLength
								},
								min: {
									expression: validations.firstNameMinValidator,
									message: app.text.minFirstNameLength
								},
								required: {
									expression: validations.required,
									message: app.text.requiredField
								}
							}
						},
						{
							className: 'col-sm-6 col-xs-6',
							key: 'contactDetails.name.last',
							name: 'last',
							type: 'input',
							templateOptions: {
								placeholder: app.text.lastNamePlaceholder
							},
							validators: {
								max: {
									expression: validations.lastNameMaxValidator,
									message: app.text.maxLastNameLength
								},
								min: {
									expression: validations.lastNameMinValidator,
									message: app.text.minLastNameLength
								},
								required: {
									expression: validations.required,
									message: app.text.requiredField
								}
							}
						}
					]
				},
				{
					key: 'paymentCard.address.line1',
					name: 'line1',
					type: 'input',
					templateOptions: {
						label: app.text.billingAddressHeadingLabel,
						placeholder: app.text.billingAddressHeadingPlaceholder
					},
					validators: {
						max: {
							expression: validations.line1MaxValidator,
							message: app.text.maxLine1Length
						},
						min: {
							expression: validations.line1MinValidator,
							message: app.text.minLine1Length
						},
						required: {
							expression: validations.required,
							message: app.text.requiredField
						}
					}
				},
				{
					template: '<label>' + app.text.cityLabel + ', ' + app.text.stateLabel +
					', ' + app.text.postalCodeLabel + '</label>'
				},
				{
					className: 'row',
					fieldGroup: [
						{
							className: 'col-sm-7 col-xs-12',
							key: 'paymentCard.address.city',
							name: 'city',
							type: 'input',
							templateOptions: {
								placeholder: app.text.cityPlaceholder
							},
							validators: {
								max: {
									expression: validations.cityMaxValidator,
									message: app.text.maxCityLength
								},
								min: {
									expression: validations.cityMinValidator,
									message: app.text.minCityLength
								},
								required: {
									expression: validations.required,
									message: app.text.requiredField
								}
							}
						},
						{
							className: 'col-sm-5 col-xs-5',
							key: 'paymentCard.address.countrySubdivision',
							name: 'countrySubdivision',
							type: 'selectWithPlaceholder',
							templateOptions: {
								placeholder: app.text.statePlaceholder,
								valueProp: 'code',
								labelProp: 'name'
							},
							expressionProperties: {
								'templateOptions.options': function() {
									return countrySubDivisions;
								}
							},
							validators: {
								required: {
									expression: validations.required,
									message: app.text.requiredField
								}
							}
						},
						{
							className: 'col-sm-12 col-xs-7',
							key: 'paymentCard.address.postalCode',
							name: 'postalCode',
							type: 'input',
							templateOptions: {
								placeholder: app.text.postalCodePlaceholder
							},
							validators: {
								max: {
									expression: validations.zipMaxValidator,
									message: app.text.maxZipLength
								},
								min: {
									expression: validations.zipMinValidator,
									message: app.text.minZipLength
								},
								required: {
									expression: validations.required,
									message: app.text.requiredField
								}
							}
						}
					]
				},
				{
					key: 'paymentCard.useBillingAddressAsShippingAddress',
					name: 'useBillingAddressAsShippingAddress',
					type: 'checkbox',
					templateOptions: {
						label: app.text.useAsShippingLabel
					},
					/**
					 * If suppress shipping address is true then Check box will not be shown else
					 * checkbox will be shown.
					 */
					hide: suppressShippingAddress
				},
				{
					template: '<label>' + app.text.phoneNumberLabel + '</label>',
					hide: hidePhoneNumberFields
				},
				{
					className: 'row',
					fieldGroup: [
						{
							className: 'col-sm-4 col-xs-4',
							key: 'contactDetails.mobilePhone.countryCode',
							name: 'countryCode',
							type: 'input',
							templateOptions: {
								disabled: true
							},
							// CountryCode field will be hidden on billing info screen only
							hide: true
						},
						{
							className: 'col-sm-8 col-xs-8',
							key: 'contactDetails.mobilePhone.phoneNumber',
							name: 'phoneNumber',
							type: 'input',
							templateOptions: {
								placeholder: app.text.phoneNumberPlaceholder
							},
							expressionProperties: {
								'templateOptions.focus': focusDuplicateCredentialField
							},
							validators: {
								required: {
									expression: validations.required,
									message: app.text.requiredField
								},
								phoneDigit: {
									expression: validations.phoneDigitValidator,
									message: app.text.phoneValidatorError
								},
								max: {
									expression: validations.phoneNumberMaxValidator,
									message: app.text.maxPhoneNumberLength
								},
								min: {
									expression: validations.phoneNumberMinValidator,
									message: app.text.minPhoneNumberLength
								},
								duplicate: {
									expression: triggerDuplicateCredentialValidation,
									message: app.text.duplicatePhoneMessage
								}
							},
							hide: hidePhoneNumberFields
						}
					]
				},
				{
					key: 'contactDetails.emailAddress',
					name: 'email',
					type: 'input',
					templateOptions: {
						type: 'email',
						label: app.text.emailLabel
					},
					expressionProperties: {
						'templateOptions.focus': focusDuplicateCredentialField
					},
					validators: {
						required: {
							expression: validations.required,
							message: app.text.requiredField
						},
						duplicate: {
							expression: triggerDuplicateCredentialValidation,
							message: app.text.duplicateEmailMessage
						},
						emailValidator: {
							expression: validations.emailValidator,
							message: app.text.emailValidation
						}
					},
					hide: !hidePhoneNumberFields
				},
				{
					template: '<label>' + app.text.passwordLabel + '</label>'
				},
				{
					className: 'row',
					fieldGroup: [
						{
							className: 'col-sm-7 col-xs-7',
							key: 'contactDetails.password',
							name: 'password',
							type: 'input',
							templateOptions: {
								placeholder: app.text.passwordPlaceholder,
								type: 'password'
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
									return vm.profile.showPassword ? 'text' : 'password';
								}
							}
						},
						{
							className: 'col-sm-2 col-xs-2',
							key: 'contactDetails.password',
							type: 'password-strength',
							templateOptions: {
								strengthString: [
									app.text.passwordTooShort,
									app.text.passwordVeryWeak,
									app.text.passwordWeak,
									app.text.passwordMedium,
									app.text.passwordGood,
									app.text.passwordStrong,
									app.text.passwordVeryStrong
								]
							}
						},
						{
							className: 'col-sm-3 col-xs-3',
							key: 'showPassword',
							name: 'showPassword',
							type: 'checkbox',
							templateOptions: {
								label: app.text.showPasswordLabel
							}
						}
					]
				}
			];
		}

	}

})();
