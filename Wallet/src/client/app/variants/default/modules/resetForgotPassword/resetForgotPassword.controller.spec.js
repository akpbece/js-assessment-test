/* jshint -W117 */
describe('ResetForgotPasswordController', function() {
	var controller, scope, sandbox, flowstackStub;

	var apiTestData = {
		baseConfig: {
			basePath: '' // we set this in app run from the build data from conductor.
		},
		requestNames: {
			forgotPassword: {
				basePath: '/api/',
				endpoint: 'resetForgotPassword',
				method: 'POST'
			}
		}
	};

	beforeEach(function() {
		bard.appModule('resetForgotPassword');
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
			'session');
		scope = $rootScope.$new();
		scope.app = {text: {}};

		api.init(apiTestData);

		controller = $controller('ResetForgotPasswordController', {
			$scope: scope
		});

		sandbox = sinon.sandbox.create();

		scope.vm = controller;
		controller.options =
		{
			resetModel: function() {
				return true;
			}
		};
		controller.resetForgotPasswordDetail = {password: 'test@123'};
		$httpBackend.whenPOST('/api/forgotPassword')
			.respond(200, {data: 'request processed.'});

		flowstackStub = sandbox.stub(flowstack, 'add', function() {
			var self = this;
			var priorityStack = [];
			priorityStack.push.apply(priorityStack, arguments);
			return self;
		});

	});

	describe('Reset Forgot Password Controller -- ', function() {

		it(' should be created successfully', function() {
			expect(controller).to.be.defined;
		});

		describe('Create & Continue Button Click --', function() {

			it('should be called with response sucess - true, username as email and password', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						success: true
					});
					return defer.promise;
				});
				controller.resetForgotPasswordRequestData = {password: controller.resetForgotPasswordDetail};
				sinon.spy(controller, 'resetForgotPasswordClick');
				controller.resetForgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.resetForgotPasswordClick).to.be.called;
			});

			it('should be called with response errors with undefined', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: undefined
					});
					return defer.promise;
				});
				controller.resetForgotPasswordRequestData = {username: 'TEST456@mastercard.com', password: 'test@123'};
				sinon.spy(controller, 'resetForgotPasswordClick');
				controller.resetForgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.resetForgotPasswordClick).to.be.called;
			});

			it('should be called with response errors with error code  - SYSTEM_ERROR', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{reasonCode: 'SYSTEM_ERROR', reasonDescription: 'SYSTEM_ERROR'}]
					});
					return defer.promise;
				});
				controller.resetForgotPasswordRequestData = {username: 'TEST456@mastercard.com', password: 'test@123'};
				sinon.spy(controller, 'resetForgotPasswordClick');
				controller.resetForgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.resetForgotPasswordClick).to.be.called;
			});

			it('should be called with response errors with error code  - PASSWORD_POLICY_MISMATCH', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{
							reasonCode: 'PASSWORD_POLICY_MISMATCH',
							reasonDescription: 'PASSWORD_POLICY_MISMATCH'
						}]
					});
					return defer.promise;
				});
				controller.resetForgotPasswordRequestData = {username: 'TEST456@mastercard.com', password: 'test@123'};
				sinon.spy(controller, 'resetForgotPasswordClick');
				controller.resetForgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.resetForgotPasswordClick).to.be.called;
			});

			it('should be called with response errors with error code  - WALLET_LOCKED_AND_RESET_NOT_ALLOWED', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{
							reasonCode: 'WALLET_LOCKED_AND_RESET_NOT_ALLOWED',
							reasonDescription: 'WALLET_LOCKED_AND_RESET_NOT_ALLOWED'
						}]
					});
					return defer.promise;
				});
				controller.resetForgotPasswordRequestData = {username: 'TEST456@mastercard.com', password: 'test@123'};
				sinon.spy(controller, 'resetForgotPasswordClick');
				controller.resetForgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.resetForgotPasswordClick).to.be.called;
			});

			it('should be called with response errors with error code  - WALLET_TEMP_LOCKED', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{reasonCode: 'WALLET_TEMP_LOCKED', reasonDescription: 'WALLET_TEMP_LOCKED'}]
					});
					return defer.promise;
				});
				controller.resetForgotPasswordRequestData = {username: 'TEST456@mastercard.com', password: 'test@123'};
				sinon.spy(controller, 'resetForgotPasswordClick');
				controller.resetForgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.resetForgotPasswordClick).to.be.called;
			});

			it('should be called with response errors with error code  - UNKNOWN', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{reasonCode: 'UNKNOWN', reasonDescription: 'UNKNOWN'}]
					});
					return defer.promise;
				});
				controller.resetForgotPasswordRequestData = {username: 'TEST456@mastercard.com', password: 'test@123'};
				sinon.spy(controller, 'resetForgotPasswordClick');
				controller.resetForgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.resetForgotPasswordClick).to.be.called;
			});

			it('should be called if resetForgot API failed', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.reject();
					return defer.promise;
				});
				controller.resetForgotPasswordRequestData = {username: 'TEST456@mastercard.com', password: 'test@123'};
				sinon.spy(controller, 'resetForgotPasswordClick');
				controller.resetForgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.resetForgotPasswordClick).to.be.called;
			});
		});
	});

});
