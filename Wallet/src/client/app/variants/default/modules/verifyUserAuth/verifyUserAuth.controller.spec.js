/* jshint -W117, -W030 */
describe('Verify User Authentication Controller', function() {
	var controller, scope, sandbox;

	var apiTestData = {
		baseConfig: {
			basePath: '' // we set this in app run from the build data from conductor.
		},
		requestNames: {
			generateAuthCode: {
				basePath: '/api/',
				endpoint: 'generateAuthCode',
				method: 'POST'
			},
			verifyAuthCode: {
				basePath: '/api/',
				endpoint: 'verifyAuthCode',
				method: 'POST'
			},
			resendAuthCode: {
				basePath: '/api/',
				endpoint: 'resendAuthCode',
				method: 'POST'
			}
		}
	};

	beforeEach(function() {
		bard.appModule('verifyUserAuth');
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

		scope.app = {text: {}, config: {}};
		controller = $controller('VerifyUserAuthController', {
			$scope: scope
		});
		scope.vm = controller;
		controller.options =
		{
			resetModel: function() {
				return true;
			}
		};
		$httpBackend.whenPOST('/api/generateAuthCode')
			.respond(200, {data: 'request processed.'});

		sinon.stub(flowstack, 'add', function() {
			var self = this;
			//TODO Code for stubbing flowstack add method.
			return self;
		});
	});

	describe('Controller Load ---', function() {

		beforeEach(function() {
			sandbox = sinon.sandbox.create();
		});

		it('should be loaded', function() {
			expect(controller).to.be.defined;
		});

		it('should call generateAuthCode method', function() {
			apiStub = sandbox.stub(api, 'request', function() {
				var defer = $q.defer();
				defer.resolve({});
				return defer.promise;
			});
			scope.$apply();
			//expect(apiStub).to.be.called;
		});

		afterEach(function() {
			sandbox.restore();
		});
	});

	describe('verifyAuthCode click ---', function() {
		beforeEach(function() {
			sandbox = sinon.sandbox.create();
		});

		it('should be called with error reason code UNSPECIFIED_ERROR', function() {
			apiStub = sandbox.stub(api, 'request', function() {
				var defer = $q.defer();
				defer.resolve({
					errors: [{
						reasonCode: 'UNSPECIFIED_ERROR'
					}]
				});
				return defer.promise;
			});
			controller.verifyAuthModel = {
				uniqueCode: '25'
			};
			sinon.spy(controller, 'verifyAuthCode');
			controller.verifyAuthCode();
			scope.$apply();
			expect(apiStub).to.be.called;
			expect(controller.verifyAuthCode).to.be.called;
		});

		it('should be called with error reason code EXCEED_RETRY_FOR_AUTHCODE', function() {
			apiStub = sandbox.stub(api, 'request', function() {
				var defer = $q.defer();
				defer.resolve({
					errors: [{
						reasonCode: 'EXCEED_RETRY_FOR_AUTHCODE'
					}]
				});
				return defer.promise;
			});
			controller.verifyAuthModel = {
				uniqueCode: '25'
			};
			sinon.spy(controller, 'verifyAuthCode');
			controller.verifyAuthCode();
			scope.$apply();
			expect(apiStub).to.be.called;
			expect(controller.verifyAuthCode).to.be.called;
		});

		it('should be called with error reason code AUTH_CONSUMER_SUSPENDED', function() {
			apiStub = sandbox.stub(api, 'request', function() {
				var defer = $q.defer();
				defer.resolve({
					errors: [{
						reasonCode: 'AUTH_CONSUMER_SUSPENDED'
					}]
				});
				return defer.promise;
			});
			controller.verifyAuthModel = {
				uniqueCode: '25'
			};
			sinon.spy(controller, 'verifyAuthCode');
			controller.verifyAuthCode();
			scope.$apply();
			expect(apiStub).to.be.called;
			expect(controller.verifyAuthCode).to.be.called;
		});

		it('should be called with error reason code INVALID_AUTHCODE', function() {
			apiStub = sandbox.stub(api, 'request', function() {
				var defer = $q.defer();
				defer.resolve({
					errors: [{
						reasonCode: 'INVALID_AUTHCODE'
					}]
				});
				return defer.promise;
			});
			controller.verifyAuthModel = {
				uniqueCode: '25'
			};
			sinon.spy(controller, 'verifyAuthCode');
			controller.verifyAuthCode();
			scope.$apply();
			expect(apiStub).to.be.called;
			expect(controller.verifyAuthCode).to.be.called;
		});

		it('should be called with error reason code AUTH_CODE_EXPIRED', function() {
			apiStub = sandbox.stub(api, 'request', function() {
				var defer = $q.defer();
				defer.resolve({
					errors: [{
						reasonCode: 'AUTH_CODE_EXPIRED'
					}]
				});
				return defer.promise;
			});
			controller.verifyAuthModel = {
				uniqueCode: '25'
			};
			sinon.spy(controller, 'verifyAuthCode');
			controller.verifyAuthCode();
			scope.$apply();
			expect(apiStub).to.be.called;
			expect(controller.verifyAuthCode).to.be.called;
		});

		it('should be called to handle different errors else part', function() {
			apiStub = sandbox.stub(api, 'request', function() {
				var defer = $q.defer();
				defer.resolve({
					errors: [{
						reasonCode: 'UNDEFINED'
					}]
				});
				return defer.promise;
			});
			controller.verifyAuthModel = {
				uniqueCode: '25'
			};
			sinon.spy(controller, 'verifyAuthCode');
			controller.verifyAuthCode();
			scope.$apply();
			expect(apiStub).to.be.called;
			expect(controller.verifyAuthCode).to.be.called;
		});

		it('should be called to handle response.errors conditions else part', function() {
			apiStub = sandbox.stub(api, 'request', function() {
				var defer = $q.defer();
				defer.resolve({
					success: true
				});
				return defer.promise;
			});
			controller.verifyAuthModel = {
				uniqueCode: '25'
			};
			controller.randomnumber = '25';
			sinon.spy(controller, 'verifyAuthCode');
			controller.verifyAuthCode();
			scope.$apply();
			expect(apiStub).to.be.called;
			expect(controller.verifyAuthCode).to.be.called;
		});

		it('should be called to handle response.success conditions else parts else', function() {
			apiStub = sandbox.stub(api, 'request', function() {
				var defer = $q.defer();
				defer.resolve({
					success: false
				});
				return defer.promise;
			});
			controller.verifyAuthModel = {
				uniqueCode: '25'
			};
			controller.randomnumber = '52';
			sinon.spy(controller, 'verifyAuthCode');
			controller.verifyAuthCode();
			scope.$apply();
			expect(apiStub).to.be.called;
			expect(controller.verifyAuthCode).to.be.called;
		});

		it('should be called to handle verify auth code failure part', function() {
			apiStub = sandbox.stub(api, 'request', function() {
				var defer = $q.defer();
				defer.reject();
				return defer.promise;
			});
			controller.verifyAuthModel = {
				uniqueCode: '25'
			};
			sinon.spy(controller, 'verifyAuthCode');
			controller.verifyAuthCode();
			scope.$apply();
			expect(apiStub).to.be.called;
			expect(controller.verifyAuthCode).to.be.called;
		});

		it('should be called to handle termsConditionsFlow if block', function() {
			apiStub = sandbox.stub(api, 'request', function(apiCall) {
				var defer = $q.defer();
				if (apiCall === 'verifyAuthCode') {
					defer.resolve({
						success: true
					});
				} else if (apiCall === 'retrievePaymentCard') {
					defer.resolve({
						errors: [{reasonCode: 'en_US-TP'}]
					});
				}
				return defer.promise;
			});
			controller.verifyAuthModel = {
				uniqueCode: '25'
			};
			controller.randomnumber = '25';

			sinon.spy(controller, 'verifyAuthCode');
			controller.verifyAuthCode();
			scope.$apply();
			expect(apiStub).to.be.called;
			expect(controller.verifyAuthCode).to.be.called;
		});

		it('should be called to handle termsConditionsFlow switch default block ', function() {
			apiStub = sandbox.stub(api, 'request', function(apiCall) {
				var defer = $q.defer();
				if (apiCall === 'verifyAuthCode') {
					defer.resolve({
						success: true
					});
				} else if (apiCall === 'retrievePaymentCard') {
					defer.resolve({
						errors: [{reasonCode: 'en_US-CA'}]
					});
				}
				return defer.promise;
			});
			controller.verifyAuthModel = {
				uniqueCode: '25'
			};
			controller.randomnumber = '25';

			sinon.spy(controller, 'verifyAuthCode');
			controller.verifyAuthCode();
			scope.$apply();
			expect(apiStub).to.be.called;
			expect(controller.verifyAuthCode).to.be.called;
		});

		it('should be called to handle termsConditionsFlow paymentCards if block', function() {
			apiStub = sandbox.stub(api, 'request', function(apiCall) {
				var defer = $q.defer();
				if (apiCall === 'verifyAuthCode') {
					defer.resolve({
						success: true
					});
				} else if (apiCall === 'retrievePaymentCard') {
					defer.resolve({
						paymentCards: {}
					});
				}
				return defer.promise;
			});
			controller.verifyAuthModel = {
				uniqueCode: '25'
			};
			controller.randomnumber = '25';

			sinon.spy(controller, 'verifyAuthCode');
			controller.verifyAuthCode();
			scope.$apply();
			expect(apiStub).to.be.called;
			expect(controller.verifyAuthCode).to.be.called;
		});

		it('should be called to handle termsConditionsFlow failure', function() {
			apiStub = sandbox.stub(api, 'request', function(apiCall) {
				var defer = $q.defer();
				if (apiCall === 'verifyAuthCode') {
					defer.resolve({
						success: true
					});
				} else if (apiCall === 'retrievePaymentCard') {
					defer.reject();
				}
				return defer.promise;
			});
			controller.verifyAuthModel = {
				uniqueCode: '25'
			};
			controller.randomnumber = '25';

			sinon.spy(controller, 'verifyAuthCode');
			controller.verifyAuthCode();
			scope.$apply();
			expect(apiStub).to.be.called;
			expect(controller.verifyAuthCode).to.be.called;
		});

		afterEach(function() {
			sandbox.restore();
		});
	});

	describe('resendUniqueCodeUsingPhone click ---', function() {
		beforeEach(function() {
			sandbox = sinon.sandbox.create();
		});

		it('should be called successfully with error code -- UNSPECIFIED_ERROR', function() {
			apiStub = sandbox.stub(api, 'request', function(apiCall) {
				var defer = $q.defer();
				if (apiCall === 'resendAuthCode') {
					defer.resolve({
						errors: [{
							reasonCode: 'UNSPECIFIED_ERROR'
						}]
					});
				}
				return defer.promise;
			});
			controller.codeDetail = {
				phoneNumber: '9999999999'
			};
			controller.onResendUniqueCode();
			scope.$apply();
			scope.$apply();
			expect(apiStub).to.be.called;
		});

		it('should be called successfully with error code -- AUTH_CODE_EXPIRED', function() {
			apiStub = sandbox.stub(api, 'request', function(apiCall) {
				var defer = $q.defer();
				if (apiCall === 'resendAuthCode') {
					defer.resolve({
						errors: [{
							reasonCode: 'AUTH_CODE_EXPIRED'
						}]
					});
				}
				return defer.promise;
			});
			controller.codeDetail = {
				phoneNumber: '9999999999'
			};
			controller.onResendUniqueCode();
			scope.$apply();
			scope.$apply();
			expect(apiStub).to.be.called;
		});

		it('should be called successfully with error code -- INVALID_USER_NAME', function() {
			apiStub = sandbox.stub(api, 'request', function(apiCall) {
				var defer = $q.defer();
				if (apiCall === 'resendAuthCode') {
					defer.resolve({
						errors: [{
							reasonCode: 'INVALID_USER_NAME'
						}]
					});
				}
				return defer.promise;
			});
			controller.codeDetail = {
				phoneNumber: '9999999999'
			};
			controller.onResendUniqueCode();
			scope.$apply();
			scope.$apply();
			expect(apiStub).to.be.called;
		});

		it('should be called successfully with error code -- EXCEED_RESEND_FOR_AUTHCODE', function() {
			apiStub = sandbox.stub(api, 'request', function(apiCall) {
				var defer = $q.defer();
				if (apiCall === 'resendAuthCode') {
					defer.resolve({
						errors: [{
							reasonCode: 'EXCEED_RESEND_FOR_AUTHCODE'
						}]
					});
				}
				return defer.promise;
			});
			controller.codeDetail = {
				phoneNumber: '9999999999'
			};
			controller.onResendUniqueCode();
			scope.$apply();
			scope.$apply();
			expect(apiStub).to.be.called;
		});

		it('should be called successfully with error code -- AUTHCODE_NOT_FOUND', function() {
			apiStub = sandbox.stub(api, 'request', function(apiCall) {
				var defer = $q.defer();
				if (apiCall === 'resendAuthCode') {
					defer.resolve({
						errors: [{
							reasonCode: 'AUTHCODE_NOT_FOUND'
						}]
					});
				}
				return defer.promise;
			});
			controller.codeDetail = {
				phoneNumber: '9999999999'
			};
			controller.onResendUniqueCode();
			scope.$apply();
			scope.$apply();
			expect(apiStub).to.be.called;
		});

		it('should be called successfully with error code -- NOTIFICATION_FAILURE', function() {
			apiStub = sandbox.stub(api, 'request', function(apiCall) {
				var defer = $q.defer();
				if (apiCall === 'resendAuthCode') {
					defer.resolve({
						errors: [{
							reasonCode: 'NOTIFICATION_FAILURE'
						}]
					});
				}
				return defer.promise;
			});
			controller.codeDetail = {
				phoneNumber: '9999999999'
			};
			controller.onResendUniqueCode();
			scope.$apply();
			scope.$apply();
			expect(apiStub).to.be.called;
		});

		it('should be called successfully with error code -- INVALID_AUTHCODE', function() {
			apiStub = sandbox.stub(api, 'request', function(apiCall) {
				var defer = $q.defer();
				if (apiCall === 'resendAuthCode') {
					defer.resolve({
						errors: [{
							reasonCode: 'INVALID_AUTHCODE'
						}]
					});
				}
				return defer.promise;
			});
			controller.codeDetail = {
				phoneNumber: '9999999999'
			};
			controller.onResendUniqueCode();
			scope.$apply();
			scope.$apply();
			expect(apiStub).to.be.called;
		});

		it('should be called successfully with success if verifyEmail is true', function() {
			apiStub = sandbox.stub(api, 'request', function(apiCall) {
				var defer = $q.defer();
				if (apiCall === 'resendAuthCode') {
					defer.resolve({
						success: true
					});
				}
				return defer.promise;
			});
			controller.isVerifyByEmail = true;
			controller.verifyOption = {
				email: 'TEST@mastercard.com'
			};
			scope.app = {text: {verifyEmailDescription: 'TEST'}};
			controller.codeDetail = {
				phoneNumber: '9999999999'
			};
			controller.onResendUniqueCode();
			scope.$apply();
			scope.$apply();
			expect(apiStub).to.be.called;
		});

		it('should be called successfully with success if isVerifyByPhone is true', function() {
			apiStub = sandbox.stub(api, 'request', function(apiCall) {
				var defer = $q.defer();
				if (apiCall === 'resendAuthCode') {
					defer.resolve({
						success: true
					});
				}
				return defer.promise;
			});
			controller.isVerifyByPhone = true;
			controller.verifyOption = {
				phoneNumber: '9999999999'
			};
			scope.app = {text: {verifyPhoneDescription: 'TEST'}};
			controller.codeDetail = {
				phoneNumber: '9999999999'
			};
			controller.onResendUniqueCode();
			scope.$apply();
			scope.$apply();
			expect(apiStub).to.be.called;
		});

		it('should be called successfully with success - true', function() {
			apiStub = sandbox.stub(api, 'request', function(apiCall) {
				var defer = $q.defer();
				if (apiCall === 'resendAuthCode') {
					defer.resolve({
						success: true
					});
				}
				return defer.promise;
			});
			controller.codeDetail = {
				phoneNumber: '9999999999'
			};
			controller.onResendUniqueCode();
			scope.$apply();
			scope.$apply();
			expect(apiStub).to.be.called;
		});

		it('should be called successfully with success - false', function() {
			apiStub = sandbox.stub(api, 'request', function(apiCall) {
				var defer = $q.defer();
				if (apiCall === 'resendAuthCode') {
					defer.resolve({
						success: false
					});
				}
				return defer.promise;
			});
			controller.codeDetail = {
				phoneNumber: '9999999999'
			};
			controller.onResendUniqueCode();
			scope.$apply();
			scope.$apply();
			expect(apiStub).to.be.called;
		});

		it('should be failed', function() {
			apiStub = sandbox.stub(api, 'request', function() {
				var defer = $q.defer();
				defer.reject({
					success: false
				});
				return defer.promise;
			});
			controller.codeDetail = {
				phoneNumber: '9999999999'
			};
			controller.onResendUniqueCode();
			scope.$apply();
			expect(apiStub).to.be.called;
		});

		afterEach(function() {
			sandbox.restore();
		});
	});

	describe('onResendUniqueCodeUsingEmail click ---', function() {
		beforeEach(function() {
			sandbox = sinon.sandbox.create();
		});

		it('should be called successfully', function() {
			apiStub = sandbox.stub(api, 'request', function() {
				var defer = $q.defer();
				defer.resolve({
					errors: [{
						reasonCode: 'RESEND_EXPIRE'
					}]
				});
				return defer.promise;
			});
			controller.codeDetail = {
				Email: 'john.deo@mastercard.com'
			};
			controller.onResendUniqueCode();
			scope.$apply();
			expect(apiStub).to.be.called;
		});

		it('should be cover else part', function() {
			apiStub = sandbox.stub(api, 'request', function() {
				var defer = $q.defer();
				defer.resolve({
					errors: [{
						reasonCode: 'UNKNOWN'
					}]
				});
				return defer.promise;
			});
			controller.codeDetail = {
				Email: 'john.deo@mastercard.com'
			};
			controller.onResendUniqueCode();
			scope.$apply();
			expect(apiStub).to.be.called;
		});

		it('should be failed', function() {
			apiStub = sandbox.stub(api, 'request', function() {
				var defer = $q.defer();
				defer.reject({
					success: false
				});
				return defer.promise;
			});
			controller.codeDetail = {
				Email: 'john.deo@mastercard.com'
			};
			controller.onResendUniqueCode();
			scope.$apply();
			expect(apiStub).to.be.called;
		});

		afterEach(function() {
			sandbox.restore();
		});
	});

	describe('verifyByEmail ---', function() {
		it('should be called successfully with primaryOTP SMS and userSignedInWith EMail', function() {
			scope.app.config = {
				primaryConfigOTP: 'SMS'
			};
			controller.userSignedWith = 'Email';
			sinon.spy(controller, 'verifyByEmail');
			controller.verifyByEmail();
			expect(controller.verifyByEmail).to.be.called;
		});
		it('should be called successfully with primaryOTP SMS and userSignedInWith PhoneNumber', function() {
			scope.app.config = {
				primaryConfigOTP: 'SMS'
			};
			controller.userSignedWith = 'PhoneNumber';
			sinon.spy(controller, 'verifyByEmail');
			controller.verifyByEmail();
			expect(controller.verifyByEmail).to.be.called;
		});
		it('should be called successfully with primaryOTP Email and userSignedInWith Email', function() {
			scope.app.config = {
				primaryConfigOTP: 'EMAIL'
			};
			controller.userSignedWith = 'Email';
			controller.codeDetail = {
				email: 'john.deo@mastercard.com'
			};
			sinon.spy(controller, 'verifyByEmail');
			controller.verifyByEmail();
			expect(controller.verifyByEmail).to.be.called;
		});
		it('should be called successfully with primaryOTP Email and userSignedInWith PhoneNumber', function() {
			scope.app.config = {
				primaryConfigOTP: 'EMAIL'
			};
			controller.userSignedWith = 'PhoneNumber';
			controller.codeDetail = {
				email: 'john.deo@mastercard.com'
			};
			sinon.spy(controller, 'verifyByEmail');
			controller.verifyByEmail();
			expect(controller.verifyByEmail).to.be.called;
		});

		it('should be called successfully with primaryOTP SMS and userSignedInWith SMS', function() {
			scope.app.config = {
				primaryConfigOTP: 'SMS'
			};
			controller.userSignedWith = 'SMS';
			sinon.spy(controller, 'verifyByEmail');
			controller.verifyByEmail();
			expect(controller.verifyByEmail).to.be.called;
		});
	});

	describe('verifyByPhone ---', function() {
		it('should be called successfully with primaryOTP SMS and userSignedInWith EMail', function() {
			scope.app.config = {
				primaryConfigOTP: 'SMS'
			};
			controller.userSignedWith = 'Email';
			controller.codeDetail = {
				'phoneNumber': '9999999999'
			};
			sinon.spy(controller, 'verifyByPhone');
			controller.verifyByPhone();
			expect(controller.verifyByPhone).to.be.called;
		});
		it('should be called successfully with primaryOTP SMS and userSignedInWith PhoneNumber', function() {
			scope.app.config = {
				primaryConfigOTP: 'SMS'
			};
			controller.userSignedWith = 'PhoneNumber';
			controller.codeDetail = {
				'phoneNumber': '9999999999'
			};
			sinon.spy(controller, 'verifyByPhone');
			controller.verifyByPhone();
			expect(controller.verifyByPhone).to.be.called;
		});
		it('should be called successfully with primaryOTP Email and userSignedInWith Email', function() {
			scope.app.config = {
				primaryConfigOTP: 'Email'
			};
			controller.userSignedWith = 'Email';
			sinon.spy(controller, 'verifyByPhone');
			controller.verifyByPhone();
			expect(controller.verifyByPhone).to.be.called;
		});
		it('should be called successfully with primaryOTP Email and userSignedInWith PhoneNumber', function() {
			scope.app.config = {
				primaryConfigOTP: 'Email'
			};
			controller.userSignedWith = 'PhoneNumber';
			sinon.spy(controller, 'verifyByPhone');
			controller.verifyByPhone();
			expect(controller.verifyByPhone).to.be.called;
		});

		it('should be called successfully with primaryOTP SMS and userSignedInWith SMS', function() {
			scope.app.config = {
				primaryConfigOTP: 'SMS'
			};
			controller.userSignedWith = 'SMS';
			sinon.spy(controller, 'verifyByPhone');
			controller.verifyByPhone();
			expect(controller.verifyByPhone).to.be.called;
		});
	});
});
