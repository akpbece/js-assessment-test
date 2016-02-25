/* jshint -W117 */
describe('TermsController', function() {
	var controller, scope, sandbox, flowstackStub, flowstackbackStub, apiSuccessStub, apiFailStub;
	var apiTestData = {
		baseConfig: {
			basePath: '' // we set this in app run from the build data from conductor.
		},
		requestNames: {
			updateLegalDocs: {
				basePath: '/wallet/clientapi/walletapi/private/v6/',
				endpoint: 'updatelegaldocs',
				method: 'POST'
			}
		}
	};
	var apiSuccessResponse = {
		data: {
			response: 'write your response here.'
		}
	};
	var apiFailResponse = {
		data: {
			responseText: 404
		}
	};
	beforeEach(function() {
		bard.appModule('terms');
		bard.inject('$controller', '$rootScope', 'flowstack', 'api', '$q');
		scope = $rootScope.$new();
		scope.app = {text: {}, config: {termsURL: ''}};
		api.init(apiTestData);
		controller = $controller('TermsController', {
			$scope: scope
		});

		sandbox = sinon.sandbox.create();
		flowstackStub = sandbox.stub(flowstack, 'add', function() {
			var self = this;
			var priorityStack = [];
			priorityStack.push.apply(priorityStack, arguments);
			return self;
		});
		flowstackbackStub = sandbox.stub(flowstack, 'back', function() {
			var self = this;
			var priorityStack = [];
			priorityStack.push.apply(priorityStack, arguments);
			return self;
		});
		scope.vm = controller;
		scope.vm.terms = {
			legalTermsRequest: true
		};
	});

	describe('Terms Controller -- ', function() {

		it(' should be created successfully', function() {
			expect(controller).to.be.defined;
		});

		it(' terms & conditions cancelled should be called successfully', function() {
			controller.termsConditionCancelled();
			expect(flowstackStub).to.be.defined;
			expect(flowstackbackStub).to.be.defined;
		});

		describe('Terms & condition Success API --', function() {
			beforeEach(function() {
				apiSuccessStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve(apiSuccessResponse);
					return defer.promise;
				});
			});
			it(' should be called successfully', function() {
				controller.termsConditionAccepted();
				scope.$apply();
				expect(apiSuccessStub).to.be.called;
			});
		});

		describe('Terms & condition Fail API --', function() {
			beforeEach(function() {
				apiFailStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.reject(apiFailResponse);
					return defer.promise;
				});
			});
			it(' should not be called successfully', function() {
				controller.termsConditionAccepted();
				scope.$apply();
				expect(apiFailStub).to.be.called;
			});
		});
	});
});
