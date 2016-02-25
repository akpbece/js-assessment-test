
describe('Repeat Complete Directive', function() {
	var compile, scope, directiveEl, sandbox;

	beforeEach(function() {
		module('app.directives');
		module('app.core');

		sandbox = sinon.sandbox.create();

		inject(function($compile, $rootScope) {
			compile = $compile;
			scope = $rootScope.$new();
		});

		sandbox.spy(scope, '$emit');

		directiveEl = getCompiledElement();

		function getCompiledElement() {
			var element = angular.element('<div ng-repeat="shipping in [1,2,3]" repeat-complete></div>');
			var compiledElement = compile(element)(scope);
			scope.$digest();
			return compiledElement;
		}

	});

	afterEach(function() {
		sandbox.restore();
	});

	it('should emit `repeatCompleted` event', inject(function($timeout) {
		$timeout.flush();
		expect(scope.$emit).to.have.been.calledOnce;
		expect(scope.$emit).to.have.been.calledWith('repeatCompleted');
	}));
});
