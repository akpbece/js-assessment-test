/* jshint -W117, -W030 */
describe('ShippingAddressController', function() {
	var controller, scope, apiStub, sandbox;
	var countries = [
		{
			code: 'GB',
			name: 'United Kingdom',
			callingCode: '44',
			locales: [{
				locale: 'en-GB',
				language: 'English(GB)',
				extensionPoint: null
			}],
			extensionPoint: null
		}, {
			code: 'US',
			name: 'United States',
			callingCode: '1',
			locales: [{
				locale: 'iw-US',
				language: '×¢×‘×¨×™×ª(US)',
				extensionPoint: null
			}, {
				locale: 'en-US',
				language: 'English(US)',
				extensionPoint: null
			}],
			extensionPoint: null
		}
	];

	var apiTestData = {
		baseConfig: {
			basePath: '' // we set this in app run from the build data from conductor.
		},
		requestNames: {
			userInformation: {
				basePath: '/api/',
				endpoint: 'userInformation',
				method: 'POST'
			}
		}
	};
	var apiSuccessResponse = {
		shippingDestination : {
			id: '123ShippingId'
		}
	};
	var apiFailResponse = {
		data: {
			responseText: 404
		}
	};
	var profile = {
		profile : {
			mobilePhone: {
				countryCode: '1',
				phoneNumber: '123123123'
			},
			name: {
				first: 'Hardik',
				last: 'Kaji'
			}
		}
	};

	beforeEach(function() {
		bard.appModule('shippingAddress');
		bard.inject
		('$controller', '$rootScope', '$log', 'logger', 'validations', 'session',
			'flowstack', '$httpBackend', 'api', '$q');
		sandbox = sinon.sandbox.create();
		session.set('locale', 'en-us');
		session.set('merchant.allowedShipToCountries', 'US,CA');
		session.set('merchant.suppressShippingAddress', 'invalid');
		session.set('profile', profile);
		session.set('profile.billingAddress',{
			city: 'AL'
		});
		sandbox.spy(logger, 'info');
		scope = $rootScope.$new();
		scope.app = {text: {}};
		controller = $controller('ShippingAddressController', {
			$scope: scope,
			countries: countries
		});
		scope.vm = controller;
		scope.vm.shippingDestination = {
			phoneNumber: {},
			address: {
				country: 'US'
			}
		};
	});

	describe('Shipping Address Controller', function() {

		describe('On Form submit --', function() {
			beforeEach(function() {
				api.init(apiTestData);
			});

			afterEach(function() {
				sandbox.restore();
			});

			it('should call post successfully if form is valid.', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve(apiSuccessResponse);
					return defer.promise;
				});

				controller.submit();
				scope.$apply();
				expect(apiStub).to.be.called;
			});

			it('should call create profile API but fail in case of 404 no API found', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.reject(apiFailResponse);
					return defer.promise;
				});

				controller.submit();
				scope.$apply();
				expect(apiStub).to.be.called;
			});
		});

		// Todo - add this in when its built.
		describe('Use my billing Address', function() {
			beforeEach(function() {
				api.init(apiTestData);
			});

			afterEach(function() {
				sandbox.restore();
			});

			it('should call create profile API successfully', function() {
				apiStub = sandbox.stub(api, 'request', function() {
					var defer = $q.defer();
					defer.resolve(apiSuccessResponse);
					return defer.promise;
				});

				controller.useMyBillingAddress();
				expect(apiStub).to.be.called;
			});
		});
	});

	describe('When the controller calls activate method', function() {
		it('should call activate info.', function() {
			expect(logger.info).to.have.been.calledOnce;
			expect(logger.info).to.have.been.calledWith('Activated the Shipping Address View.');
		});
		it('should create form fields', function() {
			expect(controller.fields).to.exist;
			expect(controller.fields).to.be.isArray;
			expect(controller.fields).to.have.length(7);
		});
	});

	describe('Shipping address Controller ---', function() {

		beforeEach(function() {
			scope = $rootScope.$new();
			scope.app = {text: {}};
			session.set('merchant.allowedShipToCountries', 'CA');
			session.set('merchant.suppressShippingAddress', 'false');
			session.set('profile', profile);
			session.set('locale', '');
			controller = $controller('ShippingAddressController', {
				$scope: scope,
				countries: countries
			});
			scope.vm = controller;
		});

		it('should be created successfully.', function() {
			expect(controller).to.be.defined;
		});

		describe('after activate', function() {
			it('should have title of User Information page', function() {
				expect(controller.title).to.equal('Shipping Address');
			});
		});
	});
});
