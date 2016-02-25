/**
 * Nice tutorial on stubbing a promise
 * http://juristr.com/blog/2015/06/learning-ng-testing-promises/
 */

describe('Bundle Factory:', function() {
	var bundle, $http, logger, canary, $q, $rootScope;
	var sandbox, $scope;

	beforeEach(function() {
		module('app.core');
		module('core.canary');
		module('core.bundle');
	});

	beforeEach(inject(function(_bundle_, _$http_, _logger_, _canary_, _$q_, _$rootScope_) {
		bundle = _bundle_;
		$http = _$http_;
		logger = _logger_;
		canary = _canary_;
		$q = _$q_;
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new();

		sandbox = sinon.sandbox.create();
	}));

	afterEach(function() {
		sandbox.restore();
	});

	it('should exist', function() {
		expect(bundle).to.exist;
	});

	/**
	 * Can barely unit test this factory due to no access to functions
	 * and bundles Object - will need to refactor bundle.js to be able
	 * to fully test this better
	 */
	describe('Bundle `get` method', function() {
		var canaryResponse = {
			variantId: 'newPaymentCard',
			bundleId: 'text'
		};

		beforeEach(function() {
			sandbox.stub($http, 'get', function() {
				return {
					success: function(callback) {
						callback('greatest callback of all');
					}
				};
			});

			sandbox.stub(logger, 'info');
			sandbox.stub(canary, 'get', function() {
				var defer = $q.defer();
				defer.resolve(canaryResponse);
				return defer.promise;
			});
		});

		it('should request a canary service', function() {
			bundle.get('text', 'phoenix', 'default');
			$scope.$apply();
			expect(logger.info).to.have.been.called;
			expect(logger.info).to.have.been.calledWith('retrieved remote - Type is:');
			expect(logger.info).to.have.been.calledWith('text');

			bundle.get('text', 'phoenix', 'default');
		});
	});

});
