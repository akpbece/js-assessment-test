
/**
 * @module directive: passwordStrength
 * @description Indicate password strength
 */
(function() {
	'use strict';

	angular
		.module('userInformation')
		.directive('passwordStrength', passwordStrength);

	/* @ngInject */
	function passwordStrength() {
		var directive = {
			require: 'ngModel',
			restrict: 'E',
			scope: {
				password: '=ngModel'
			},
			template: '{{strength}}',
			link: link
		};

		return directive;

		function link(scope, ele, attr) {

			scope.$watch('password', function(newVal) {
				scope.strength = getPasswordStrength(newVal);
			}, true);

			/**
			 * @function getPasswordStrength
			 * @description Provides password strength.
			 * @param   {string}  value 	Password
			 * @return  {string}  Password strength
			 */
			function getPasswordStrength(value) {
				var strength = 0;
				var strengthMap = JSON.parse(attr.strengthString);
				var REGEX_NUMBERS = /.*\d/;
				var REGEX_LETTERS_LOWERCASE = /.*[a-z]/;
				var REGEX_LETTERS_UPPERCASE = /.*[A-Z]/;
				var REGEX_CHARACTERS = /.*\W+/;

				if (value && value.length >= 6) {
					if (value.length >= 12) {
						strength += 1;	// if password is at least 12 characters
					}
					if (REGEX_LETTERS_LOWERCASE.test(value)) {
						strength += 1;	// if password contains at least one lowercase letter
					}
					if (REGEX_LETTERS_UPPERCASE.test(value)) {
						strength += 1;	// if password contains at least one uppercase letter
					}
					if (REGEX_NUMBERS.test(value)) {
						strength += 1;	// if password contains at least one number
					}
					if (REGEX_CHARACTERS.test(value)) {
						strength += 1;	// if password contains at least one special character
					}
					if (getUniqueCharString(value).length >= 5) {
						strength += 1;	// if password contains at least 5 unique character
					}
				}
				return strengthMap[strength];
			}

			/**
			 * @function getUniqueCharString
			 * @description Returns unique character string of input string.
			 * @param   {string}  value
			 * @return  {string}  Unique character string
			 */
			function getUniqueCharString(value) {
				var uniqueCharStr = '';
				_.each(value, function buildUniqueCharStr(val) {
					if (!_.contains(uniqueCharStr,val)) {
						uniqueCharStr += val;
					}
				});
				return uniqueCharStr;
			}

		}
	}

})();
