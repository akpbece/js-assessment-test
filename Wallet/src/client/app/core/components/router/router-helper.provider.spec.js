var TEST_STATES = [{
	state: 'testState',
	config: {
		url: '/',
		templateUrl: 'app/modules/landing/landing.html',
		controller: 'TestingController',
		controllerAs: 'vm'
	}
}];

describe('Test router-helper provider', function() {

	var routerHelperProvider,
		rootScope,
		sandbox;

	beforeEach(module('app.core'));

	beforeEach(inject(function injectIntoTests(
		_$rootScope_,
		_routerHelper_
	) {
		rootScope = _$rootScope_;

		sandbox = sinon.sandbox.create();
		sandbox.spy(rootScope, '$on');

		routerHelperProvider = _routerHelper_;
	}));

	afterEach(function() {
		sandbox.restore();
	});

	it('tests the provider is initialized', function() {
		expect(routerHelperProvider).to.exist;
	});

	it('tests the provider has methods', function() {
		// methods
		expect(routerHelperProvider.configureStates).to.be.a('function');
		// expect(routerHelperProvider.getStates).to.be.a('function'); // this method came with a generator but is unused
	});

	it('tests the provider has proper attributes', function() {
		expect(routerHelperProvider.stateCounts).to.be.an('object');
		expect(routerHelperProvider.hasOtherwisePath).to.be.a('boolean');
		expect(routerHelperProvider.hasHandlingStateChangeError).to.be.a('boolean');
	});

	it('tests the provider configures states properly', function() {
		expect(routerHelperProvider.configureStates(TEST_STATES)).to.be.undefined;
	});

}); // end describe

describe('Test rootScope $stateChangeSuccess', function() {

	var routerHelperProvider,
		rootScope,
		sandbox;

	beforeEach(module('app.core'));

	beforeEach(inject(function injectIntoTests(
		_$rootScope_
	) {
		rootScope = _$rootScope_;

		sandbox = sinon.sandbox.create();
		sandbox.spy(rootScope, '$on');
	}));

	afterEach(function() {
		sandbox.restore();
	});

	it('tests the scoped events', inject(function(_routerHelper_) {
		routerHelperProvider = _routerHelper_;
		expect(rootScope.$on).to.have.been.called;
		expect(rootScope.$on).to.have.been.calledWith('$stateChangeSuccess');
		expect(rootScope.$on).to.have.been.calledWith('$stateChangeError');
	}));

	it('should broadcast scoped events', inject(function(_routerHelper_) {
		// inits
		routerHelperProvider = _routerHelper_;

		// broadcasts
		rootScope.$broadcast('$stateChangeSuccess');
		expect(routerHelperProvider.stateCounts.changes).to.be.above(0);
		expect(routerHelperProvider.hasHandlingStateChangeError).to.be.false;

		rootScope.$broadcast('$stateChangeError');
		expect(routerHelperProvider.stateCounts.errors).to.be.above(0);
		expect(routerHelperProvider.hasHandlingStateChangeError).to.be.true;

		// test escape statement
		rootScope.$broadcast('$stateChangeError');
		expect(routerHelperProvider.hasHandlingStateChangeError).to.be.true;

	}));

}); // end describe
