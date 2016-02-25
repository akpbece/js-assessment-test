/* jshint -W117, -W030 */
/* jshint -W064 */ //ignore new required with constructor

describe('SigninController', function() {
	var controller, scope, apiStub, sandbox;

	var apiTestConfig = {
		baseConfig: {
			basePath: 'unit'
		},
		requestNames: {
			login: {
				endpoint: '/login',
				method: 'POST'
			},
			getProfile: {
				endpoint: '/profile',
				method: 'GET'
			}
		}
	};

	var apiSuccessResponse = {
		errors: [
			{
				reasonCode: 'AUTH_UNSPECIFIED_LOGIN_ERROR'
			}
		]
	};
	var apiFailResponse = {
		errors: {
			responseCode: 500
		}
	};

	beforeEach(function() {
		bard.appModule('signin');
		bard.inject(
			'$controller',
			'$rootScope',
			'$q',
			'$httpBackend',
			'api',
			'session',
			'logger',
			'$log',
			'$http',
			'flowstack'
		);

		sandbox = sinon.sandbox.create();
		api.init(apiTestConfig);
		scope = $rootScope.$new();
		scope.app = {text: {}, config: {primaryConfigOTP: 'SMS'}};
		session.set('username', 'John');
		controller = $controller('SigninController', {
			$scope: scope
		});
		scope.vm = controller;
		scope.vm.user = {
			username: 'John'
		};
		/*
		 * Mocking options resetModel function which is part of formly.
		 */
		scope.vm.options = {
			resetModel: function() {
				return true;
			}
		};

		flowStackAddStub = sandbox.stub(flowstack, 'add', function() {
			var self = this;
			return self;
		});

		flowStackAddStub = sandbox.stub(flowstack, 'next', function() {
			var self = this;
			return self;
		});

	});

	afterEach(function() {
		sandbox.restore();
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});


	describe('Signin controller', function() {

		it('should be created successfully', function() {
			expect(controller).to.be.defined;
		});

		describe('after activate', function() {

			it('should have title of Sign In', function() {
				expect(controller.title).to.equal('Sign In');
			});
		});

		describe(' Login button click -- ', function() {
			beforeEach(function() {
				sandbox = sinon.sandbox.create();
			});

			it('form submit with response with errorcode - AUTH_UNSPECIFIED_LOGIN_ERROR', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve(apiSuccessResponse);
					return defer.promise;
				});
				controller.signin();
				scope.$apply();
				expect(apiStub).to.be.called;
			});

			it('form submit with response with errorcode - AUTH_ACCOUNT_LOCKED', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{
							reasonCode: 'AUTH_ACCOUNT_LOCKED'
						}]
					});
					return defer.promise;
				});
				controller.signin();
				scope.$apply();
				expect(apiStub).to.be.called;
			});

			it('form submit with response with errorcode - AUTH_CONSUMER_SUSPENDED', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{
							reasonCode: 'AUTH_CONSUMER_SUSPENDED'
						}]
					});
					return defer.promise;
				});
				controller.signin();
				scope.$apply();
				expect(apiStub).to.be.called;
			});

			it('form submit with response with errorcode - OTP_AUTH_CHALLENGE_REQUIRED', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{
							reasonCode: 'OTP_AUTH_CHALLENGE_REQUIRED'
						}]
					});
					return defer.promise;
				});
				controller.signin();
				scope.$apply();
				expect(apiStub).to.be.called;
			});

			it('form submit with response with errorcode - UNKNOWN', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{
							reasonCode: 'UNKNOWN'
						}]
					});
					return defer.promise;
				});
				controller.signin();
				scope.$apply();
				expect(apiStub).to.be.called;
			});

			it('Successfully form submit with success - true boolean', function() {
				scope.app = {text: {}, config: {primaryConfigOTP: 'SMS'}};
				controller = $controller('SigninController', {
					$scope: scope
				});
				scope.vm = controller;
				scope.vm.options = {
					resetModel: function() {
						return true;
					}
				};
				apiStub = sandbox.stub(api, 'request', function(apiCall) {
					var defer = $q.defer();
					if (apiCall === 'login') {
						defer.resolve({
							loginResponse: {
								success: true
							}
						});
					} else if (apiCall === 'retrievePaymentCard') {
						defer.resolve({
							errors: [{
								reasonCode: 'LEGAL_REQUIRED-en_US'
							}]
						});
					}

					return defer.promise;
				});
				scope.vm.user.username = 'TEST@master.com';
				controller.signin();
				scope.$apply();
				expect(apiStub).to.be.called;
			});

			it('Successfully form submit with success - true string, primaryConfigOTP: EMAIL', function() {
				scope.app = {text: {}, config: {primaryConfigOTP: 'EMAIL'}};
				controller = $controller('SigninController', {
					$scope: scope
				});
				scope.vm = controller;
				scope.vm.options = {
					resetModel: function() {
						return true;
					}
				};
				apiStub = sandbox.stub(api, 'request', function(apiCall) {
					var defer = $q.defer();
					if (apiCall === 'login') {
						defer.resolve({
							loginResponse: {
								success: 'true'
							}
						});
					} else if (apiCall === 'retrievePaymentCard') {
						defer.resolve({
							errors: [{
								reasonCode: 'LEGAL_REQUIRED-TP-en_US'
							}]
						});
					}

					return defer.promise;
				});
				scope.vm.user.username = 'TEST@master.com';
				controller.signin();
				scope.$apply();
				expect(apiStub).to.be.called;
			});

			it('Successfully form submit with success - true string, primaryConfigOTP: NONE', function() {
				scope.app = {text: {}, config: {primaryConfigOTP: 'NONE'}};
				controller = $controller('SigninController', {
					$scope: scope
				});
				scope.vm = controller;
				scope.vm.options = {
					resetModel: function() {
						return true;
					}
				};
				apiStub = sandbox.stub(api, 'request', function(apiCall) {
					var defer = $q.defer();
					if (apiCall === 'login') {
						defer.resolve({
							loginResponse: {
								success: 'true'
							}
						});
					} else if (apiCall === 'retrievePaymentCard') {
						defer.resolve({
							errors: [{
								reasonCode: 'LEGAL_REQUIRED-TP-en_US'
							}]
						});
					}

					return defer.promise;
				});
				scope.vm.user.username = 'TEST@master.com';
				controller.signin();
				scope.$apply();
				expect(apiStub).to.be.called;
			});

			it('Successfully form submit with success - true string and retrievePaymentCard responded paymentCards', function() {
				scope.app = {text: {}, config: {primaryConfigOTP: 'NONE'}};
				controller = $controller('SigninController', {
					$scope: scope
				});
				scope.vm = controller;
				scope.vm.options = {
					resetModel: function() {
						return true;
					}
				};
				apiStub = sandbox.stub(api, 'request', function(apiCall) {
					var defer = $q.defer();
					if (apiCall === 'login') {
						defer.resolve({
							loginResponse: {
								success: 'true'
							}
						});
					} else if (apiCall === 'retrievePaymentCard') {
						defer.resolve({
							paymentCards: {}
						});
					}

					return defer.promise;
				});
				scope.vm.user.username = 'TEST@master.com';
				controller.signin();
				scope.$apply();
				expect(apiStub).to.be.called;
			});

			it('Successfully form submit with success - true string and retrievePaymentCard responded in faliure', function() {
				scope.app = {text: {}, config: {primaryConfigOTP: 'NONE'}};
				controller = $controller('SigninController', {
					$scope: scope
				});
				scope.vm = controller;
				scope.vm.options = {
					resetModel: function() {
						return true;
					}
				};
				apiStub = sandbox.stub(api, 'request', function(apiCall) {
					var defer = $q.defer();
					if (apiCall === 'login') {
						defer.resolve({
							loginResponse: {
								success: 'true'
							}
						});
					} else if (apiCall === 'retrievePaymentCard') {
						defer.reject();
					}

					return defer.promise;
				});
				scope.vm.user.username = 'TEST@master.com';
				controller.signin();
				scope.$apply();
				expect(apiStub).to.be.called;
			});

			it('should not be called post successfully if form is invalid.', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						loginResponse: {
							success: false
						}
					});
					return defer.promise;
				});
				scope.vm.user.username = 'TEST@master.com';
				controller.signin();
				scope.$apply();
				expect(apiStub).to.be.called;
			});

			it('Login faliue handling', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.reject(apiFailResponse);
					return defer.promise;
				});
				scope.vm.user.username = 'TEST@master.com';
				controller.signin();
				scope.$apply();
				expect(apiStub).to.be.called;
			});

			it('forgotPasswordLink Click ', function() {
				controller.forgotPasswordLinkClick();
			});

		});

		//describe('should called to handle handleTermsConditionFlow', function() {
		//	beforeEach(function() {
		//		sandbox = sinon.sandbox.create();
		//		scope.app = {text: {}, config: {primaryConfigOTP: 'EMAIL'}};
		//		session.set('username', 'John');
		//		controller = $controller('SigninController', {
		//			$scope: scope
		//		});
		//		apiStub = sandbox.stub(api, 'request', function(apiCall) {
		//			var defer = $q.defer();
		//			if (apiCall === 'getProfile') {
		//				defer.resolve({
		//					loginResponse: {
		//						success: true
		//					}
		//				});
		//			} else if (apiCall === 'retrievePaymentCard') {
		//				defer.resolve({
		//					errors: [{
		//						reasonCode: 'LEGAL_REQUIRED-en_US'
		//					}]
		//				});
		//			}
		//
		//			return defer.promise;
		//		});
		//	});
		//
		//	it('should not be called post successfully if form is invalid.', function() {
		//		controller.signin();
		//		scope.$apply();
		//		expect(apiStub).to.be.called;
		//	});
		//});
		//
		//describe('In case of not receiving payment card data ', function() {
		//	beforeEach(function() {
		//		sandbox = sinon.sandbox.create();
		//		//flowStackAddStub = sandbox.stub(flowstack, 'next', function() {
		//		//	var self = this;
		//		//	return self;
		//		//});
		//	});
		//
		//	it('should not be called post successfully if form is invalid.', function() {
		//		apiStub = sandbox.stub(api, 'request', function() {
		//			var defer = $q.defer();
		//			defer.resolve({loginResponse: {success: true}});
		//			return defer.promise;
		//		});
		//		scope.vm.user.username = 'TEST@master.com';
		//		controller.signin();
		//		scope.$apply();
		//		expect(apiStub).to.be.called;
		//	});
		//});
		//
		//describe('Successfully form submit with paymentCards get is response with success status', function() {
		//	beforeEach(function() {
		//		sandbox = sinon.sandbox.create();
		//		//flowStackAddStub = sandbox.stub(flowstack, 'next', function() {
		//		//	var self = this;
		//		//	return self;
		//		//});
		//
		//	});
		//
		//	it('should not be called post successfully if form is invalid.', function() {
		//		apiStub = sandbox.stub(api, 'request', function() {
		//			var defer = $q.defer();
		//			defer.resolve({loginResponse: {success: true}});
		//			return defer.promise;
		//		});
		//		controller.signin();
		//		scope.$apply();
		//		expect(apiStub).to.be.called;
		//	});
		//});
		//

		//
		//	it('should not be called post successfully if form is invalid.', function() {
		//		controller.signin();
		//		scope.$apply();
		//		expect(apiStub).to.be.called;
		//	});
		//});
	});
});
