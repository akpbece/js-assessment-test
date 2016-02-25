/* jshint -W117, -W030 */
describe('UserInformationController', function() {
	var controller,
		scope,
		apiStub,
		sandbox;

	var apiTestData = {
		baseConfig: {
			basePath: '' // we set this in app run from the build data from conductor.
		},
		requestNames: {
			userInformation: {
				basePath: 'mocks/',
				endpoint: 'userInformation/data.json',
				method: 'GET'
			},
			countrySubDivision: {
				basePath: 'mocks/',
				endpoint: '/countrySubDivision/US/data.json',
				method: 'GET'
			},
			savePaymentCard: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/paymentcard',
				method: 'POST'
			},
			saveShippingDestination: {
				endpoint: '/wallet/clientapi/walletapi/private/v6/shippingdestination',
				method: 'POST'
			},
			createProfile: {
				endpoint: '/wallet/clientapi/walletapi/public/v6/:walletId/profile',
				method: 'POST'
			}
		}
	};

	var apiSuccessResponse = 'request processed';

	var apiFailResponse = {
		data: {
			responseText: 404
		}
	};
	var stateParams = {
		secondaryCredentialType: 'email'
	};

	beforeEach(function() {
		module('userInformation');
		bard.inject(
			'$controller',
			'$log',
			'$rootScope',
			'logger',
			'$http',
			'$httpBackend',
			'$state',
			'flowstack',
			'api',
			'$q',
			'session',
			'$stateParams'
		);
		session.set('locale', 'en-us');
		session.set('merchant.allowedShipToCountries', 'US,CA');
		session.set('registrationDataFromSwitch', {
			usernameType: 'email',
			paymentCard: {
				accountNumber: '5422506972616689',
				securityCode: '123',
				expirationDate: {
					month: 11,
					year: 17
				}
			}
		});
		scope = $rootScope.$new();
		api.init(apiTestData);

		sandbox = sinon.sandbox.create();
		apiStub = sandbox.stub(api, 'request', function() {
			var defer = $q.defer();
			defer.resolve(apiSuccessResponse);
			return defer.promise;
		});

		scope.app = {text: {}};
		controller = $controller('UserInformationController', {
			$scope: scope,
			hidePhoneNumberFields: true,
			$stateParams: stateParams
		});
		scope.vm = controller;

		$httpBackend.whenPOST('/wallet/clientapi/walletapi/private/v6/paymentcard')
			.respond(200, {});
		$httpBackend.whenPOST('/wallet/clientapi/walletapi/private/v6/shippingdestination')
			.respond(200, {});
		$httpBackend.whenPOST('/wallet/clientapi/walletapi/public/v6/walletId/profile')
			.respond(200, {});

		controller.profile = {
			contactDetails: {
				name: {
					first: 'Our',
					last: 'User'
				},
				emailAddress: 'text@test.com',
				mobilePhone: {
					countryCode: '1'
				},
				countryOfResidence: 'US-VA',
				locale: 'en-US',
				nationalId: 'US'
			},
			paymentCard: {
				address: {
					country: 'US',
					line1: '123main',
					line2: 'Box4',
					line3: 'Apt1',
					city: 'StCharles',
					postalCode: '3012',
					countrySubdivision: 'MO'
				},
				useBillingAddressAsShippingAddress: false
			},
			shippingAddress: null
		};
		sandbox.stub($state, 'go');
	});

	afterEach(function() {
		sandbox.restore();
	});

	bard.verifyNoOutstandingHttpRequests();

	describe('User Information Controller --', function() {

		it('should be created successfully', function() {
			expect(controller).to.be.defined;
		});

		describe('after activate', function() {

			beforeEach(function() {
				stateparams = {secondaryCredentialType: 'email'};

				controller = $controller('UserInformationController', {
					$scope: scope,
					hidePhoneNumberFields: true,
					$stateParams: stateParams
				});

				// For mocking $setTouched function for email
				// and phoneNumber field
				controller.userForm = {
					phoneNumber: {
						$setTouched: function() {
						}
					},
					email: {
						$setTouched: function() {
						}
					}
				};
			});

			it('should have title of User Information page', function() {
				expect(controller.title).to.equal('User Information');
			});
			it('should have a setModelDataFromSwitchSignupPage method', function() {
				expect(controller.setModelDataFromSwitchSignupPage).isFunction;
			});

			it('phoneNumber should be focused and validation should be triggered' +
				' if duplicate credential found for phoneNumber', function() {
				// for resolving promises calling scope.$apply()
				scope.$apply();
				var phoneNumberField = controller.fields[6].fieldGroup[1];
				controller.isDuplicateCredentialFound = true;
				controller.duplicateCredential = {
					type: 'phone',
					validationTriggered: false
				};
				expect(phoneNumberField.expressionProperties['templateOptions.focus']()).to.be.true;
				expect(phoneNumberField.validators.duplicate.expression()).to.be.false;
			});

			it('phoneNumber should not be focused and validation should not be triggered' +
				' if duplicate credential not found for phoneNumber', function() {
				// for resolving promises calling scope.$apply()
				scope.$apply();
				var phoneNumberField = controller.fields[6].fieldGroup[1];
				controller.isDuplicateCredentialFound = false;
				controller.duplicateCredential = {
					type: 'phone',
					validationTriggered: true
				};
				expect(phoneNumberField.expressionProperties['templateOptions.focus']()).to.be.false;
				expect(phoneNumberField.validators.duplicate.expression()).to.be.true;
			});

			it('Email should be focused and validation should be triggered' +
				' if duplicate credential found for Email', function() {
				// for resolving promises calling scope.$apply()
				scope.$apply();
				var emailField = controller.fields[7];
				controller.isDuplicateCredentialFound = true;
				controller.duplicateCredential = {
					type: 'email',
					validationTriggered: false
				};
				expect(emailField.expressionProperties['templateOptions.focus']()).to.be.true;
				expect(emailField.validators.duplicate.expression()).to.be.false;
			});

			it('Email should not be focused and validations should not be triggered' +
				' if duplicate credential not found for Email', function() {
				// for resolving promises calling scope.$apply()
				scope.$apply();
				var emailField = controller.fields[7];
				controller.isDuplicateCredentialFound = false;
				controller.duplicateCredential = {
					type: 'phone',
					validationTriggered: true
				};
				expect(emailField.expressionProperties['templateOptions.focus']()).to.be.false;
				expect(emailField.validators.duplicate.expression()).to.be.true;
			});

			it('password should be shown if consumer has checked show password checkbox', function() {
				// for resolving promises calling scope.$apply()
				scope.$apply();
				controller.profile.showPassword = true;
				var passwordField = controller.fields[9].fieldGroup[0];
				expect(passwordField.expressionProperties['templateOptions.type']()).to.be.equal('text');
			});

			it('password should be not shown if consumer has unchecked show password checkbox', function() {
				// for resolving promises calling scope.$apply()
				scope.$apply();
				controller.profile.showPassword = false;
				var passwordField = controller.fields[9].fieldGroup[0];
				expect(passwordField.expressionProperties['templateOptions.type']()).to.be.equal('password');
			});
		});

		describe('If setModelDataFromSwitchSignupPage is called with phone username Type', function() {

			beforeEach(function() {
				stateparams = {secondaryCredentialType: 'email'};

				controller = $controller('UserInformationController', {
					$scope: scope,
					hidePhoneNumberFields: true,
					$stateParams: stateParams
				});

			});

			it('should call setModelDataFromSwitchSignupPage method with unsernameType is Phone', function() {
				expect(controller.profile.contactDetails.mobilePhone.phoneNumber).to.be.equal(session.get('registrationDataFromSwitch').username);
			});

		});

		describe('If setModelDataFromSwitchSignupPage is called with email username Type', function() {

			beforeEach(function() {
				stateparams = {secondaryCredentialType: 'email'};

				controller = $controller('UserInformationController', {
					$scope: scope,
					hidePhoneNumberFields: true,
					$stateParams: stateParams
				});

			});

			it('should call setModelDataFromSwitchSignupPage method with unsernameType is Email', function() {
				expect(controller.profile.contactDetails.emailAddress).to.be.equal(session.get('registrationDataFromSwitch').username);
			});

		});

		describe('after fetching card data from switch', function() {
			it('should retrieved last 4 digits of card PAN number', function() {
				expect(session.get('registrationDataFromSwitch').paymentCard.accountNumber).to.be.defined;
				expect(controller.lastFourPAN).to.be.equal('6689');
			});
		});

		describe('If Profile is set in session', function() {
			beforeEach(function() {
				session.set('locale', 'en-us');
				session.set('form.userInformation', controller.profile);
				scope = $rootScope.$new();

				scope.app = {text: {}};
				controller = $controller('UserInformationController', {
					$scope: scope,
					hidePhoneNumberFields: true
				});
				scope.vm = controller;
			});

			it('it should take value from session & bind that object', function() {
				expect(session.get('form.userInformation')).to.be.equal(controller.profile);
			});
		});

		describe('If duplicate credential found', function() {
			beforeEach(function() {
				session.set('locale', 'en-us');
				session.set('profile', controller.profile);
				scope = $rootScope.$new();

				scope.app = {text: {}};
				controller = $controller('UserInformationController', {
					$scope: scope,
					hidePhoneNumberFields: true,
					$stateParams: {
						duplicate: 'email'
					}
				});
				scope.vm = controller;
			});

			it('check if email is duplicated ', function() {
				expect(controller.duplicateCredential.type === 'email').to.be.true;
			});
		});

		describe('Countries list ---', function() {
			beforeEach(function() {
				sandbox.restore();
				sandbox = sinon.sandbox.create();
			});

			afterEach(function() {
				sandbox.restore();
			});

			it('should call get countries API but fail in case of 404 no API found', function() {
				sandbox.stub(api, 'request', function() {
					return $q.reject(apiFailResponse);
				});
				controller = $controller('UserInformationController', {
					$scope: scope,
					hidePhoneNumberFields: true
				});
				expect(api.request).to.be.called;
			});
		});

		describe('On Form Submit --', function() {
			beforeEach(function() {
				sandbox.restore();
				sandbox = sinon.sandbox.create();
				/**
				 * For solving flowstack.add() flow. Stubbing that flow.
				 */
				sandbox.stub(flowstack, 'add', function() {
					var self = this;
					var priorityStack = [];
					priorityStack.push.apply(priorityStack, arguments);
					return self;
				});
			});

			afterEach(function() {
				sandbox.restore();
			});

			it('should call create profile API but fail in case of 404 no API found', function() {
				sandbox.stub(api, 'request', function() {
					return $q.reject(apiFailResponse);
				});

				controller.profile.paymentCard.useBillingAddressAsShippingAddress = true;
				controller.submit();
				expect(api.request).to.be.called;
			});
			it('should call create profile API successfully', function() {
				sandbox.stub(api, 'request', function() {
					return $q.when({
						// createProfile response
						profile: {},
						errors: undefined
					});
				});
				controller.profile.paymentCard.useBillingAddressAsShippingAddress = true;
				controller.submit();
				scope.$apply();
				expect(api.request).to.be.called;
			});

			it('should call create profile API successfully but with Duplicated invalid Email', function() {
				sandbox.stub(api, 'request', function() {
					return $q.when({
						// createProfile response
						profile: {},
						errors: [{
							'description': 'This email is already registered.',
							'reasonCode': 'INVALID_EMAIL',
							'recoverable': true,
							'source': 'CREATE_PROFILE'
						}]
					});
				});
				controller.profile.paymentCard.useBillingAddressAsShippingAddress = true;
				controller.submit();
				scope.$apply();
				expect(api.request).to.be.called;
			});

			it('should call create profile API successfully but with Duplicated invalid Phone', function() {
				sandbox.stub(api, 'request', function() {
					return $q.when({
						// createProfile response
						profile: {},
						errors: [{
							'description': 'This mobile number is already registered.',
							'reasonCode': 'INVALID_MOBILE',
							'recoverable': true,
							'source': 'CREATE_PROFILE'
						}]
					});
				});
				controller.profile.paymentCard.useBillingAddressAsShippingAddress = true;
				controller.submit();
				scope.$apply();
				expect(api.request).to.be.called;
			});

			it('should call create profile API successfully but with errors', function() {
				sandbox.stub(api, 'request', function() {
					return $q.when({
						// createProfile response
						profile: {},
						errors: {}
					});
				});
				controller.profile.paymentCard.useBillingAddressAsShippingAddress = true;
				controller.submit();
				scope.$apply();
				expect(api.request).to.be.called;
			});

			it('should call create profile API successfully and savePayment response unsucessfully', function() {
				sandbox.stub(api, 'request', function() {
					return $q.when({
						// createProfile response
						profile: {},
						errors: undefined,
						// savePaymentCard response
						addPaymentCardResponse: undefined
					});
				});
				controller.profile.paymentCard.useBillingAddressAsShippingAddress = true;
				controller.submit();
				scope.$apply();
				expect(api.request).to.be.called;
			});

			it('should call create profile API successfully and savePayment response sucessfully', function() {
				sandbox.stub(api, 'request', function() {
					return $q.when({
						// createProfile response
						profile: {},
						errors: undefined,
						// savePaymentCard response
						addPaymentCardResponse: {
							paymentCard: {
								id: 1234567890
							}
						}
					});
				});
				controller.profile.paymentCard.useBillingAddressAsShippingAddress = false;
				controller.submit();
				scope.$apply();
				expect(api.request).to.be.called;
			});

			it('Should call save shipping destination API successfully', function() {
				sandbox.stub(api, 'request', function() {
					return $q.when({
						// createProfile response
						profile: {},
						errors: undefined,
						// savePaymentCard response
						addPaymentCardResponse: {
							paymentCard: {
								id: 1234567890
							}
						}
					});
				});
				controller.profile.paymentCard.useBillingAddressAsShippingAddress = true;
				controller.submit();
				scope.$apply();
				expect(api.request).to.be.called;
			});

			it('if useforShipping is checked and currentCountry is supported by merchantShippingProfile ' +
				'should call save shipping Destination API successfully and savePayment response sucessfully', function() {
				sandbox.stub(api, 'request', function() {
					return $q.when({
						// createProfile response
						profile: {},
						errors: undefined,
						// savePaymentCard response
						addPaymentCardResponse: {
							paymentCard: {
								id: 1234567890
							}
						},
						shippingDestination: {
							preferred: true
						}
					});
				});
				controller.profile.paymentCard.useBillingAddressAsShippingAddress = true;
				controller.submit();
				scope.$apply();
				expect(api.request).to.have.been.called;
				expect(api.request).to.have.been.calledWith('saveShippingDestination');
				expect(api.request).to.have.been.calledWith('savePaymentCard');
			});

		});
	});
});
