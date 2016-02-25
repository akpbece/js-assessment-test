
describe('App Core -- Flows', function() {

	describe('core.flows module', function() {
		beforeEach(function() {
			module('core.flows');
		});

		it('should exist', inject(function(flows) {
			expect(flows).to.be.defined;
		}));
	});

});
