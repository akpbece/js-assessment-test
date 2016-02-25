
describe('Password Strength Directive', function() {
	var $scope, directiveElem;

	beforeEach(function() {
		bard.appModule('userInformation');
		bard.inject(function($compile, $rootScope) {
			$scope = $rootScope;
			var element = angular.element('<password-strength ng-model="password"></password-strength>');
			element.attr('strength-string',
				'["Too Short", "Very weak", "Weak", "Medium", "Good", "Strong", "Very Strong"]');
			directiveElem = $compile(element)($scope);
		});
	});

	describe('password', function() {
		it('should be "Very strong" if strength is 6 or more', function() {
			$scope.password = 'hello@123Pass';
			$scope.$digest();
			expect(directiveElem.text()).to.equal('Very Strong');
		});
		it('should be "Good" if strength is 4', function() {
			$scope.password = 'hello@123';
			$scope.$digest();
			expect(directiveElem.text()).to.equal('Good');
		});
		it('should be "Strong" if strength is 5', function() {
			$scope.password = 'hellO@123';
			$scope.$digest();
			expect(directiveElem.text()).to.equal('Strong');
		});
		it('should be "Too short" if strength is 0', function() {
			$scope.password = 'hello';
			$scope.$digest();
			expect(directiveElem.text()).to.equal('Too Short');
		});
		it('should be "Medium" if strength is 3', function() {
			$scope.password = 'hell1s';
			$scope.$digest();
			expect(directiveElem.text()).to.equal('Medium');
		});
	});
});
