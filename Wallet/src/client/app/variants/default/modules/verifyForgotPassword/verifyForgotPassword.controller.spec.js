/* jshint -W117 */
describe('Verify Forgot Password Controller', function() {

	var controller, scope, sandbox;

	var apiTestData = {
		baseConfig: {
			basePath: '' // we set this in app run from the build data from conductor.
		},
		requestNames: {
			forgotPassword: {
				basePath: '/api/',
				endpoint: 'verifyForgotPassword',
				method: 'POST'
			}
		}
	};

	beforeEach(function() {
		bard.appModule('verifyForgotPassword');
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
			'session'
		);

		scope = $rootScope.$new();
		api.init(apiTestData);

		scope.app = {text: {}, config: {secondary2faConfig: 'NATIONALID'}};
		session.set('locale', 'en-US');
		controller = $controller('VerifyForgotPasswordController', {
			$scope: scope
		});
		scope.vm = controller;
		controller.options = {
			resetModel: function() {
				return true;
			}
		};
		controller.secondaryOptions = {
			resetModel: function() {
				return true;
			}
		};
		$httpBackend.whenPOST('/api/verifyPassword')
			.respond(200, {data: 'request processed.'});
		sinon.stub(flowstack, 'add', function() {
			var self = this;
			//TODO Code for stubbing flowstack add method.
			return self;
		});
	});

	describe('Verify Password Controller Load ---', function() {

		beforeEach(function() {
			sandbox = sinon.sandbox.create();
		});

		it('should be loaded', function() {

			expect(controller).to.be.defined;
		});

		describe('Verify Auth Code Click ---', function() {

			it('should be called with response sucess - true and userSignInType = PHONE', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						success: true
					});
					return defer.promise;
				});
				controller.userSignInType = 'PHONE';
				controller.verifyAuthModel = {uniqueCode: '1111'};
				controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
				sinon.spy(controller, 'verifyAuthCode');
				controller.verifyAuthCode();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.verifyAuthCode).to.be.called;
			});

			it('should be called with response sucess - true and userSignInType = PHONE', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						success: 'true'
					});
					return defer.promise;
				});
				controller.userSignInType = 'PHONE';
				controller.verifyAuthModel = {uniqueCode: '1111'};
				controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
				sinon.spy(controller, 'verifyAuthCode');
				controller.verifyAuthCode();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.verifyAuthCode).to.be.called;
			});

			it('should be called with response sucess - true and userSignInType = EMAIL', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						success: true
					});
					return defer.promise;
				});
				controller.userSignInType = 'EMAIL';
				controller.verifyAuthModel = {uniqueCode: '1111'};
				controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
				sinon.spy(controller, 'verifyAuthCode');
				controller.verifyAuthCode();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.verifyAuthCode).to.be.called;
			});

			it('should be called with response sucess - true and userSignInType = UNKNOWN', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						success: true
					});
					return defer.promise;
				});
				controller.userSignInType = 'UNKNOWN';
				controller.verifyAuthModel = {uniqueCode: '1111'};
				controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
				sinon.spy(controller, 'verifyAuthCode');
				controller.verifyAuthCode();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.verifyAuthCode).to.be.called;
			});

			it('should be called when userSignInType = PHONE and response with error - reasonCode - UNSPECIFIED_ERROR', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{reasonCode: 'UNSPECIFIED_ERROR', description: 'UNSPECIFIED_ERROR'}]
					});
					return defer.promise;
				});
				controller.userSignInType = 'PHONE';
				controller.verifyAuthModel = {uniqueCode: '1111'};
				controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
				sinon.spy(controller, 'verifyAuthCode');
				controller.verifyAuthCode();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.verifyAuthCode).to.be.called;
			});

			it('should be called when userSignInType = PHONE and response with error - reasonCode - SYSTEM_ERROR', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{reasonCode: 'SYSTEM_ERROR', description: 'SYSTEM_ERROR'}]
					});
					return defer.promise;
				});
				controller.userSignInType = 'PHONE';
				controller.verifyAuthModel = {uniqueCode: '1111'};
				controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
				sinon.spy(controller, 'verifyAuthCode');
				controller.verifyAuthCode();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.verifyAuthCode).to.be.called;
			});

			it('should be called when userSignInType = PHONE and response with error - reasonCode - AUTH_UNSPECIFIED_LOGIN_ERROR', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{
							reasonCode: 'AUTH_UNSPECIFIED_LOGIN_ERROR',
							description: 'AUTH_UNSPECIFIED_LOGIN_ERROR'
						}]
					});
					return defer.promise;
				});
				controller.userSignInType = 'PHONE';
				controller.verifyAuthModel = {uniqueCode: '1111'};
				controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
				sinon.spy(controller, 'verifyAuthCode');
				controller.verifyAuthCode();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.verifyAuthCode).to.be.called;
			});

			//	it('should be called when userSignInType = PHONE and response with error - reasonCode - INVALID_USER_NAME', function() {
			//		apiStub = sandbox.stub(api, 'request', function() {
			//			var defer = $q.defer();
			//			defer.resolve({
			//				errors: [{reasonCode: 'INVALID_USER_NAME', description: 'INVALID_USER_NAME'}]
			//			});
			//			return defer.promise;
			//		});
			//		controller.userSignInType = 'PHONE';
			//		controller.verifyAuthModel = {uniqueCode: '1111'};
			//		controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
			//		sinon.spy(controller, 'verifyAuthCode');
			//		controller.verifyAuthCode();
			//		scope.$apply();
			//		expect(apiStub).to.be.called;
			//		expect(controller.verifyAuthCode).to.be.called;
			//	});

			it('should be called when userSignInType = PHONE and response with error - reasonCode - EXCEED_RETRY_FOR_AUTHCODE', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{
							reasonCode: 'EXCEED_RETRY_FOR_AUTHCODE',
							description: 'EXCEED_RETRY_FOR_AUTHCODE'
						}]
					});
					return defer.promise;
				});
				controller.userSignInType = 'PHONE';
				controller.verifyAuthModel = {uniqueCode: '1111'};
				controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
				sinon.spy(controller, 'verifyAuthCode');
				controller.verifyAuthCode();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.verifyAuthCode).to.be.called;
			});

			//	it('should be called when userSignInType = PHONE and response with error - reasonCode - AUTH_CODE_EXPIRED', function() {
			//		apiStub = sandbox.stub(api, 'request', function() {
			//			var defer = $q.defer();
			//			defer.resolve({
			//				errors: [{reasonCode: 'AUTH_CODE_EXPIRED', description: 'AUTH_CODE_EXPIRED'}]
			//			});
			//			return defer.promise;
			//		});
			//		controller.userSignInType = 'PHONE';
			//		controller.verifyAuthModel = {uniqueCode: '1111'};
			//		controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
			//		sinon.spy(controller, 'verifyAuthCode');
			//		controller.verifyAuthCode();
			//		scope.$apply();
			//		expect(apiStub).to.be.called;
			//		expect(controller.verifyAuthCode).to.be.called;
			//	});
			//
			//	it('should be called when userSignInType = PHONE and response with error - reasonCode - INVALID_AUTHCODE', function() {
			//		apiStub = sandbox.stub(api, 'request', function() {
			//			var defer = $q.defer();
			//			defer.resolve({
			//				errors: [{reasonCode: 'INVALID_AUTHCODE', description: 'INVALID_AUTHCODE'}]
			//			});
			//			return defer.promise;
			//		});
			//		controller.userSignInType = 'PHONE';
			//		controller.verifyAuthModel = {uniqueCode: '1111'};
			//		controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
			//		sinon.spy(controller, 'verifyAuthCode');
			//		controller.verifyAuthCode();
			//		scope.$apply();
			//		expect(apiStub).to.be.called;
			//		expect(controller.verifyAuthCode).to.be.called;
			//	});
			//
			//	it('should be called when userSignInType = PHONE and response with error - reasonCode - INVALID_ACCOUNT_VERIFIER_DETAILS', function() {
			//		apiStub = sandbox.stub(api, 'request', function() {
			//			var defer = $q.defer();
			//			defer.resolve({
			//				errors: [{
			//					reasonCode: 'INVALID_ACCOUNT_VERIFIER_DETAILS',
			//					description: 'INVALID_ACCOUNT_VERIFIER_DETAILS'
			//				}]
			//			});
			//			return defer.promise;
			//		});
			//		controller.userSignInType = 'PHONE';
			//		controller.verifyAuthModel = {uniqueCode: '1111'};
			//		controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
			//		sinon.spy(controller, 'verifyAuthCode');
			//		controller.verifyAuthCode();
			//		scope.$apply();
			//		expect(apiStub).to.be.called;
			//		expect(controller.verifyAuthCode).to.be.called;
			//	});
			//
			//	it('should be called when userSignInType = PHONE and response with error - reasonCode - WALLET_LOCKED_AND_RESET_NOT_ALLOWED', function() {
			//		apiStub = sandbox.stub(api, 'request', function() {
			//			var defer = $q.defer();
			//			defer.resolve({
			//				errors: [{
			//					reasonCode: 'WALLET_LOCKED_AND_RESET_NOT_ALLOWED',
			//					description: 'WALLET_LOCKED_AND_RESET_NOT_ALLOWED'
			//				}]
			//			});
			//			return defer.promise;
			//		});
			//		controller.userSignInType = 'PHONE';
			//		controller.verifyAuthModel = {uniqueCode: '1111'};
			//		controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
			//		sinon.spy(controller, 'verifyAuthCode');
			//		controller.verifyAuthCode();
			//		scope.$apply();
			//		expect(apiStub).to.be.called;
			//		expect(controller.verifyAuthCode).to.be.called;
			//	});
			//
			//	it('should be called when userSignInType = PHONE and response with error - reasonCode - UNKNOWN', function() {
			//		apiStub = sandbox.stub(api, 'request', function() {
			//			var defer = $q.defer();
			//			defer.resolve({
			//				errors: [{reasonCode: 'UNKNOWN', description: 'UNKNOWN'}]
			//			});
			//			return defer.promise;
			//		});
			//		controller.userSignInType = 'PHONE';
			//		controller.verifyAuthModel = {uniqueCode: '1111'};
			//		controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
			//		sinon.spy(controller, 'verifyAuthCode');
			//		controller.verifyAuthCode();
			//		scope.$apply();
			//		expect(apiStub).to.be.called;
			//		expect(controller.verifyAuthCode).to.be.called;
			//	});
			//
			it('should be called when userSignInType = PHONE and falied', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.reject();
					return defer.promise;
				});
				controller.userSignInType = 'PHONE';
				controller.verifyAuthModel = {uniqueCode: '1111'};
				controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
				sinon.spy(controller, 'verifyAuthCode');
				controller.verifyAuthCode();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.verifyAuthCode).to.be.called;
			});
			//
			//	it('should be called when userSignInType = PHONE and response with error - reasonCode - UNKNOWN', function() {
			//		apiStub = sandbox.stub(api, 'request', function() {
			//			var defer = $q.defer();
			//			defer.resolve({
			//				errors: [{reasonCode: 'UNKNOWN', description: 'UNKNOWN'}]
			//			});
			//			return defer.promise;
			//		});
			//		controller.userSignInType = 'PHONE';
			//		controller.verifyAuthModel = {uniqueCode: '1111'};
			//		controller.verifySecondarySecurityModel = {secondarySecurity: '4444'};
			//		sinon.spy(controller, 'verifyAuthCode');
			//		controller.verifyAuthCode();
			//		scope.$apply();
			//		expect(apiStub).to.be.called;
			//		expect(controller.verifyAuthCode).to.be.called;
			//	});
			//
			//});
			//
			describe('Verify/Resend Authcode By Phone Click ---', function() {

				it('should be called if primaryConfigOTP = SMS, userSignInType = EMAIL and response success - true', function() {
					scope.app = {text: '', config: {primaryConfigOTP: 'SMS'}};
					controller = $controller('VerifyForgotPasswordController', {
						$scope: scope
					});
					controller.options = {
						resetModel: function() {
							return true;
						}
					};
					scope.vm = controller;
					apiStub = sandbox.stub(api, 'request', function() {
						var defer = $q.defer();
						defer.resolve({
							success: true
						});
						return defer.promise;
					});
					controller.userSignInType = 'EMAIL';
					scope.$apply();
					sinon.spy(controller, 'verifyByPhone');
					controller.verifyByPhone();
					scope.$apply();
					expect(apiStub).to.be.called;
					expect(controller.verifyByPhone).to.be.called;
				});

				it('should be called if primaryConfigOTP = SMS, userSignInType = EMAIL and response success - false', function() {
					scope.app = {text: '', config: {primaryConfigOTP: 'SMS'}};
					controller = $controller('VerifyForgotPasswordController', {
						$scope: scope
					});
					controller.options = {
						resetModel: function() {
							return true;
						}
					};
					scope.vm = controller;
					apiStub = sandbox.stub(api, 'request', function() {
						var defer = $q.defer();
						defer.resolve({
							success: false
						});
						return defer.promise;
					});
					controller.userSignInType = 'EMAIL';
					scope.$apply();
					sinon.spy(controller, 'verifyByPhone');
					controller.verifyByPhone();
					scope.$apply();
					expect(apiStub).to.be.called;
					expect(controller.verifyByPhone).to.be.called;
				});

				it('should be called if primaryConfigOTP = EMAIL and userSignInType = EMAIL', function() {
					controller.userSignInType = 'EMAIL';
					scope.$apply();
					sinon.spy(controller, 'verifyByPhone');
					controller.verifyByPhone();
					scope.$apply();
					expect(apiStub).to.be.called;
					expect(controller.verifyByPhone).to.be.called;
				});

				it('should be called if primaryConfigOTP = EMAIL and userSignInType = PHONE', function() {
					scope.app = {config: {primaryConfigOTP: 'EMAIL'}};
					controller.userSignInType = 'PHONE';
					scope.$apply();
					sinon.spy(controller, 'verifyByPhone');
					controller.verifyByPhone();
					scope.$apply();
					expect(apiStub).to.be.called;
					expect(controller.verifyByPhone).to.be.called;
				});
			});
			//
			describe('Verify/Resend Authcode By Email Click if primaryConfigOTP = SMS ---', function() {

				it('should be called if primaryConfigOTP = SMS and userSignInType = EMAIL', function() {
					scope.app = {config: {primaryConfigOTP: 'SMS'}};
					controller.userSignInType = 'EMAIL';
					scope.$apply();
					sinon.spy(controller, 'verifyByEmail');
					controller.verifyByEmail();
					scope.$apply();
					expect(apiStub).to.be.called;
					expect(controller.verifyByEmail).to.be.called;
				});

				it('should be called if primaryConfigOTP = SMS and userSignInType = PHONE', function() {
					scope.app = {config: {primaryConfigOTP: 'SMS'}};
					controller.userSignInType = 'PHONE';
					scope.$apply();
					sinon.spy(controller, 'verifyByEmail');
					controller.verifyByEmail();
					scope.$apply();
					expect(apiStub).to.be.called;
					expect(controller.verifyByEmail).to.be.called;
				});

			});
			//
			describe('Verify By Email Click if primaryConfigOTP = EMAIL ---', function() {
				//
				beforeEach(function() {
					scope.app = {text: '', config: {primaryConfigOTP: 'EMAIL'}};
					controller = $controller('VerifyForgotPasswordController', {
						$scope: scope
					});
					controller.options = {
						resetModel: function() {
							return true;
						}
					};
					controller.secondaryOptions = {
						resetModel: function() {
							return true;
						}
					};
					scope.vm = controller;
				});
				//
				it('should be called if primaryConfigOTP = EMAIL and response success - true', function() {
					apiStub = sandbox.stub(api, 'request', function() {
						var defer = $q.defer();
						defer.resolve({
							success: true
						});
						return defer.promise;
					});
					scope.$apply();
					sinon.spy(controller, 'verifyByEmail');
					controller.verifyByEmail();
					scope.$apply();
					expect(apiStub).to.be.called;
					expect(controller.verifyByEmail).to.be.called;
				});
				//
				it('should be called if primaryConfigOTP = EMAIL and response success - false', function() {
					apiStub = sandbox.stub(api, 'request', function() {
						var defer = $q.defer();
						defer.resolve({
							success: false
						});
						return defer.promise;
					});
					scope.$apply();
					sinon.spy(controller, 'verifyByEmail');
					controller.verifyByEmail();
					scope.$apply();
					expect(apiStub).to.be.called;
					expect(controller.verifyByEmail).to.be.called;
				});
				//
				it('should be called if primaryConfigOTP = EMAIL and responded with reasonCode = UNSPECIFIED_ERROR ', function() {
					apiStub = sandbox.stub(api, 'request', function() {
						var defer = $q.defer();
						defer.resolve({
							errors: [{reasonCode: 'UNSPECIFIED_ERROR', description: 'UNSPECIFIED_ERROR'}]
						});
						return defer.promise;
					});
					scope.$apply();
					sinon.spy(controller, 'verifyByEmail');
					controller.verifyByEmail();
					scope.$apply();
					expect(apiStub).to.be.called;
					expect(controller.verifyByEmail).to.be.called;
				});
				//
				it('should be called if primaryConfigOTP = EMAIL and responded with reasonCode = SYSTEM_ERROR ', function() {
					apiStub = sandbox.stub(api, 'request', function() {
						var defer = $q.defer();
						defer.resolve({
							errors: [{reasonCode: 'SYSTEM_ERROR', description: 'SYSTEM_ERROR'}]
						});
						return defer.promise;
					});
					scope.$apply();
					sinon.spy(controller, 'verifyByEmail');
					controller.verifyByEmail();
					scope.$apply();
					expect(apiStub).to.be.called;
					expect(controller.verifyByEmail).to.be.called;
				});
				//
				it('should be called if primaryConfigOTP = EMAIL and responded with reasonCode = AUTH_UNSPECIFIED_LOGIN_ERROR ', function() {
					apiStub = sandbox.stub(api, 'request', function() {
						var defer = $q.defer();
						defer.resolve({
							errors: [{
								reasonCode: 'AUTH_UNSPECIFIED_LOGIN_ERROR',
								description: 'AUTH_UNSPECIFIED_LOGIN_ERROR'
							}]
						});
						return defer.promise;
					});
					scope.$apply();
					sinon.spy(controller, 'verifyByEmail');
					controller.verifyByEmail();
					scope.$apply();
					expect(apiStub).to.be.called;
					expect(controller.verifyByEmail).to.be.called;
				});
				//
				//	it('should be called if primaryConfigOTP = EMAIL and responded with reasonCode = NOTIFICATION_FAILURE ', function() {
				//		apiStub = sandbox.stub(api, 'request', function() {
				//			var defer = $q.defer();
				//			defer.resolve({
				//				errors: [{reasonCode: 'NOTIFICATION_FAILURE', description: 'NOTIFICATION_FAILURE'}]
				//			});
				//			return defer.promise;
				//		});
				//		scope.$apply();
				//		sinon.spy(controller, 'verifyByEmail');
				//		controller.verifyByEmail();
				//		scope.$apply();
				//		expect(apiStub).to.be.called;
				//		expect(controller.verifyByEmail).to.be.called;
				//	});
				//
				//	it('should be called if primaryConfigOTP = EMAIL and responded with reasonCode = INVALID_USER_NAME ', function() {
				//		apiStub = sandbox.stub(api, 'request', function() {
				//			var defer = $q.defer();
				//			defer.resolve({
				//				errors: [{reasonCode: 'INVALID_USER_NAME', description: 'INVALID_USER_NAME'}]
				//			});
				//			return defer.promise;
				//		});
				//		scope.$apply();
				//		sinon.spy(controller, 'verifyByEmail');
				//		controller.verifyByEmail();
				//		scope.$apply();
				//		expect(apiStub).to.be.called;
				//		expect(controller.verifyByEmail).to.be.called;
				//	});
				//
				//	it('should be called if primaryConfigOTP = EMAIL and responded with reasonCode = EXCEED_RESEND_FOR_AUTHCODE ', function() {
				//		apiStub = sandbox.stub(api, 'request', function() {
				//			var defer = $q.defer();
				//			defer.resolve({
				//				errors: [{reasonCode: 'EXCEED_RESEND_FOR_AUTHCODE', description: 'EXCEED_RESEND_FOR_AUTHCODE'}]
				//			});
				//			return defer.promise;
				//		});
				//		scope.$apply();
				//		sinon.spy(controller, 'verifyByEmail');
				//		controller.verifyByEmail();
				//		scope.$apply();
				//		expect(apiStub).to.be.called;
				//		expect(controller.verifyByEmail).to.be.called;
				//	});
				//
				//	it('should be called if primaryConfigOTP = EMAIL and responded with reasonCode = AUTHCODE_NOT_FOUND ', function() {
				//		apiStub = sandbox.stub(api, 'request', function() {
				//			var defer = $q.defer();
				//			defer.resolve({
				//				errors: [{reasonCode: 'AUTHCODE_NOT_FOUND', description: 'AUTHCODE_NOT_FOUND'}]
				//			});
				//			return defer.promise;
				//		});
				//		scope.$apply();
				//		sinon.spy(controller, 'verifyByEmail');
				//		controller.verifyByEmail();
				//		scope.$apply();
				//		expect(apiStub).to.be.called;
				//		expect(controller.verifyByEmail).to.be.called;
				//	});
				//
				it('should be called if primaryConfigOTP = EMAIL and responded with reasonCode = UNKNOWN ', function() {
					apiStub = sandbox.stub(api, 'request', function() {
						var defer = $q.defer();
						defer.resolve({
							errors: [{reasonCode: 'UNKNOWN', description: 'UNKNOWN'}]
						});
						return defer.promise;
					});
					scope.$apply();
					sinon.spy(controller, 'verifyByEmail');
					controller.verifyByEmail();
					scope.$apply();
					expect(apiStub).to.be.called;
					expect(controller.verifyByEmail).to.be.called;
				});
				//
				it('should be called if resendAuthCode failed ', function() {
					apiStub = sandbox.stub(api, 'request', function() {
						var defer = $q.defer();
						defer.reject();
						return defer.promise;
					});
					scope.$apply();
					sinon.spy(controller, 'verifyByEmail');
					controller.verifyByEmail();
					scope.$apply();
					expect(apiStub).to.be.called;
					expect(controller.verifyByEmail).to.be.called;
				});
				//
				//	it('should be called if primaryConfigOTP = EMAIL,response success - true and isVerifyByEmail = true', function() {
				//		apiStub = sandbox.stub(api, 'request', function() {
				//			var defer = $q.defer();
				//			defer.resolve({
				//				success: true
				//			});
				//			return defer.promise;
				//		});
				//		scope.$apply();
				//		sinon.spy(controller, 'verifyByEmail');
				//		controller.verifyByEmail();
				//		scope.$apply();
				//		expect(apiStub).to.be.called;
				//		expect(controller.verifyByEmail).to.be.called;
			});
			//
		});

	});
});
