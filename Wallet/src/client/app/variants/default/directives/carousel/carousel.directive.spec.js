
describe('Carousel Directive', function() {
	var compile, scope, directiveEl;

	beforeEach(function() {
		module('app.directives');
		module('app.core');

		inject(function($compile, $rootScope) {
			compile = $compile;
			scope = $rootScope.$new();
			scope['vm'] = {
				suppressShippingAddress: true
			};
		});

		directiveEl = getCompiledElement();

		function getCompiledElement() {
			var element = angular.element('<mc-carousel template="shipping"></mc-carousel/>');
			var compiledElement = compile(element)(scope);
			scope.$digest();
			return compiledElement;
		}

	});

	afterEach(function() {

	});

	// TODO
	it('should initialize carousel', function() {

	});

	// TODO
	it('should animate carousel', function() {

	});
	// TODO
	it('should move carousel to the left', function() {

	});
	// TODO
	it('should move carousel to the right', function() {

	});
});
