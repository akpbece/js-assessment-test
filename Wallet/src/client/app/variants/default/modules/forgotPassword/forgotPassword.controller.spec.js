/* jshint -W117 */
describe('Forgot Password Controller ', function() {
	var controller, scope, sandbox;

	var apiTestData = {
		baseConfig: {
			basePath: '' // we set this in app run from the build data from conductor.
		},
		requestNames: {
			forgotPassword: {
				basePath: '/api/',
				endpoint: 'forgotPassword',
				method: 'POST'
			}
		}
	};

	beforeEach(function() {
		bard.appModule('forgotPassword');
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
		session.set('locale','en-US');
		controller = $controller('ForgotPasswordController', {
			$scope: scope
		});
		scope.vm = controller;
		controller.options =
		{
			resetModel: function() {
				return true;
			}
		};
		$httpBackend.whenPOST('/api/forgotPassword')
			.respond(200, {data: 'request processed.'});
		sinon.stub(flowstack, 'add', function() {
			var self = this;
			//TODO Code for stubbing flowstack add method.
			return self;
		});
	});

	describe('Forgot Password Controller Load ---', function() {

		beforeEach(function() {
			sandbox = sinon.sandbox.create();
		});

		it('should be loaded', function() {
			expect(controller).to.be.defined;
		});

		describe('Send Code Button Click --', function() {

			beforeEach(function() {
				sandbox = sinon.sandbox.create();
			});

			it('should be called with response sucess - true and username as email', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						success: true
					});
					return defer.promise;
				});
				controller.forgotPasswordDetail = {username: 'TEST456@mastercard.com'};
				sinon.spy(controller, 'forgotPasswordClick');
				controller.forgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.forgotPasswordClick).to.be.called;
			});

			it('should be called with response sucess - true and username as phone number', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						success: true
					});
					return defer.promise;
				});
				controller.forgotPasswordDetail = {username: '9999999999'};
				sinon.spy(controller, 'forgotPasswordClick');
				controller.forgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.forgotPasswordClick).to.be.called;
			});

			it('should be called with response errors with error code  - SYSTEM_ERROR', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{reasonCode: 'SYSTEM_ERROR', reasonDescription: 'SYSTEM_ERROR'}]
					});
					return defer.promise;
				});
				controller.forgotPasswordDetail = {username: '9999999999'};
				sinon.spy(controller, 'forgotPasswordClick');
				controller.forgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.forgotPasswordClick).to.be.called;
			});

			it('should be called with response errors with error code  - AUTH_UNSPECIFIED_LOGIN_ERROR', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{reasonCode: 'AUTH_UNSPECIFIED_LOGIN_ERROR', reasonDescription: 'AUTH_UNSPECIFIED_LOGIN_ERROR'}]
					});
					return defer.promise;
				});
				controller.forgotPasswordDetail = {username: '9999999999'};
				sinon.spy(controller, 'forgotPasswordClick');
				controller.forgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.forgotPasswordClick).to.be.called;
			});

			it('should be called with response errors with error code  - NOTIFICATION_FAILURE', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{reasonCode: 'NOTIFICATION_FAILURE', reasonDescription: 'NOTIFICATION_FAILURE'}]
					});
					return defer.promise;
				});
				controller.forgotPasswordDetail = {username: '9999999999'};
				sinon.spy(controller, 'forgotPasswordClick');
				controller.forgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.forgotPasswordClick).to.be.called;
			});

			it('should be called with response errors with error code  - AUTH_CODE_GENERATION_FAIL', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{reasonCode: 'AUTH_CODE_GENERATION_FAIL', reasonDescription: 'AUTH_CODE_GENERATION_FAIL'}]
					});
					return defer.promise;
				});
				controller.forgotPasswordDetail = {username: '9999999999'};
				sinon.spy(controller, 'forgotPasswordClick');
				controller.forgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.forgotPasswordClick).to.be.called;
			});

			it('should be called with response errors with error code  - UNKNOWN', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors: [{reasonCode: 'UNKNOWN', reasonDescription: 'UNKNOWN'}]
					});
					return defer.promise;
				});
				controller.forgotPasswordDetail = {username: '9999999999'};
				sinon.spy(controller, 'forgotPasswordClick');
				controller.forgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.forgotPasswordClick).to.be.called;
			});

			it('should be called with response errors with undefined', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve({
						errors :undefined
					});
					return defer.promise;
				});
				controller.forgotPasswordDetail = {username: '9999999999'};
				sinon.spy(controller, 'forgotPasswordClick');
				controller.forgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.forgotPasswordClick).to.be.called;
			});

			it('should be called if forgorPassword API failed', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.reject();
					return defer.promise;
				});
				controller.forgotPasswordDetail = {username: '9999999999'};
				sinon.spy(controller, 'forgotPasswordClick');
				controller.forgotPasswordClick();
				scope.$apply();
				expect(apiStub).to.be.called;
				expect(controller.forgotPasswordClick).to.be.called;
			});

			afterEach(function() {
				sandbox.restore();
			});

		});

		afterEach(function() {
			sandbox.restore();
		});

	});

});
