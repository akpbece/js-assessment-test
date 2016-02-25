
describe('App Core -- Api Config', function() {

	describe('core.apiConfig module', function() {
		beforeEach(function() {
			module('core.apiConfig');
		});

		it('should exist', inject(function(apiConfig) {
			expect(apiConfig).to.be.defined;
		}));

		/**
		 * NOTE: We aren't going to explicitly check the config object properties because that
		 * is not really a good test.  We test the config object and component in the component repo.
		 * potentially we can do basic validation like ensure there is requestName and BaseConfig.
		 */

	});

});
