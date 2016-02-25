/**
 * Nice tutorial on stubbing a promise
 * http://juristr.com/blog/2015/06/learning-ng-testing-promises/
 */

describe('Canary Factory:', function() {
	var canary, logger, config, session, loggerStub, api, sandbox, $q;

	beforeEach(function() {
		module('app.core');
		module('core.canary');
	});

	beforeEach(inject(function($rootScope, _logger_, _config_, _session_, _$q_, _api_) {
		config = _config_;
		logger = _logger_;
		config = _config_;
		session = _session_;
		$q = _$q_;
		api = _api_;
		sandbox = sinon.sandbox.create();

		api.init({
			baseConfig: {
				// FYI: we intend to delete the static mocks soon
				basePath: 'mocks/'
			},
			requestNames: {
				canary: {
					endpoint: 'canary/data.json',
					method: 'GET'
				}
			}
		});

		sandbox.stub(api, 'request', function() {
			var defer = $q.defer();
			defer.resolve({
				variantId: 'default',
				bundleId: 'default'
			});
			return defer.promise;
		});

		config.buildUrls = {
			canaryUrl: 'mocks/canary/data.json',
			bundleUrl: 'mocks/bundle/'
		};
		session.set('locale', 'en-us');

		loggerStub = sinon.stub(logger, 'info');
	}));

	afterEach(function() {
		loggerStub.restore();
		sandbox.restore();
	});

	describe('without initialData -- ', function() {

		// inject a canary w/o cached data from config
		beforeEach(inject(function(_canary_) {
			canary = _canary_;
		}));

		describe('Get Canary method -- ', function() {
			it('should call logger info method twice', function() {
				canary.get();
				expect(loggerStub).to.have.been.calledTwice;
			});

			it('should request an canary service', function() {
				canary.get();
				expect(api.request).to.have.been.calledOnce;
			});

			// TODO: test canary.get() twice only calls get() once
			//	it('should request an canary service once', function() {
			//		canary.get();
			//		canary.get();
			//		expect(api.request).to.have.been.calledOnce;
			//	});
		});

		describe('Set Canary method -- ', function() {
			it('should log an info using logger module', function() {
				canary.set(false, 'textBundle');
				expect(loggerStub).to.have.been.calledOnce;
				expect(loggerStub).to.have.been.calledWith('variant is needed to set the canary');
			});

			it('should log an info using logger module', function() {
				canary.set('newPaymentCard', 'text');
				canary.get();
				canary.set('newRegistration', false);
				expect(loggerStub).to.not.have.been.calledWith('variant is needed to set the canary');
			});

		});

	});

	describe('with initialData -- ', function() {

		beforeEach(function() {
			config.initialData = {
				canary: {
					bundleId: 'default',
					variantId: 'default'
				}
			};
		});

		// cache canary data before inject
		beforeEach(inject(function(_canary_) {
			canary = _canary_;
		}));

		it('should not request an canary service', function() {
			canary.get();
			expect(api.request).not.to.have.been.called;
		});

	});

});
