describe('App Core --- Constants', function() {

	beforeEach(function() {
		module('app.core');
	});

	it('should exist', inject(function(config) {
		expect(config).to.be.defined;
	}));

	it('should have the following configuration', inject(function(config) {
		var coreConfig = {
			tenant: 'acmebank',
			defaultLocale: 'en-us'
		};

		expect(config).to.be.deep.equal(coreConfig);
	}));

	it('should initialize with new values plus predefined', inject(function(config) {
		config.init({
			newVal: 'test',
			newVal2: 'test2'
		});

		var initializedCoreConfig = {
			tenant: 'acmebank',
			defaultLocale: 'en-us',
			newVal: 'test',
			newVal2: 'test2'
		};

		expect(config).to.be.deep.equal(initializedCoreConfig);
	}));

	it('re-initializing should remove everything except predefined values', inject(function(config) {
		config.init({
			foo: 'bar'
		});

		var reInitializedCoreConfig = {
			tenant: 'acmebank',
			defaultLocale: 'en-us',
			foo: 'bar'
		};

		expect(config).to.be.deep.equal(reInitializedCoreConfig);
	}));

});

