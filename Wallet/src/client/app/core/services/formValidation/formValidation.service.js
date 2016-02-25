/**
 * @module factory: formValidator
 * @description Factory that provides field validation methods for formly
 */
(function() {
	'use strict';

	angular
		.module('core.formValidation')
		.service('validations', getValidations);

	/* @ngInject */
	/**
	 * @function getValidations
	 * @param  {Object} config        Configuration data
	 * @return {Object} Validation functions
	 * @description This function provides object that contains list
	 * of validation functions. These functions can be used for formly
	 * field validation.
	 */
	function getValidations(config) {
		return {

			required: function($viewValue) {
				if (!$viewValue) {
					return false;
				}
				return true;
			},

			firstNameMinValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var tooSmall = $viewValue.length < config.firstNameMinLength;
				return !tooSmall;
			},

			firstNameMaxValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var tooBig = $viewValue.length > config.firstNameMaxLength;
				return !tooBig;
			},

			lastNameMinValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var tooSmall = $viewValue.length < config.lastNameMinLength;
				return !tooSmall;
			},

			lastNameMaxValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var tooBig = $viewValue.length > config.lastNameMaxLength;
				return !tooBig;
			},

			line1MinValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var tooSmall = $viewValue.length < config.addressLine1MinLength;
				return !tooSmall;
			},

			line1MaxValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var tooBig = $viewValue.length > config.addressLine1MaxLength;
				return !tooBig;
			},

			cityMinValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var tooSmall = $viewValue.length < config.addressCityMinLength;
				return !tooSmall;
			},

			cityMaxValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var tooBig = $viewValue.length > config.addressCityMaxLength;
				return !tooBig;
			},

			zipMinValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var tooSmall = $viewValue.length < config.addressPostalCodeMinLength;
				return !tooSmall;
			},

			zipMaxValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var tooBig = $viewValue.length > config.addressPostalCodeMaxLength;
				return !tooBig;
			},

			phoneDigitValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var digitOnly = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;

				if (digitOnly.test($viewValue)) {
					return true;
				}
				else {
					return false;
				}
			},

			usernameValidator: function($viewValue) {
				var emailRegexp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
				var phoneRegexp = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;

				if (emailRegexp.test($viewValue)) {
					return true;
				}
				else if (phoneRegexp.test($viewValue)) {
					return true;
				}
				else {
					return false;
				}
			},

			passwordMinValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var tooSmall = $viewValue.length < config.passwordMinLength;
				return !tooSmall;
			},

			passwordMaxValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var tooBig = $viewValue.length > config.passwordMaxLength;
				return !tooBig;
			},

			phoneNumberMinValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var tooSmall = $viewValue.length < config.phoneNumberMinLength;
				return !tooSmall;
			},

			phoneNumberMaxValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var tooBig = $viewValue.length > config.phoneNumberMaxLength;
				return !tooBig;
			},

			emailValidator: function($viewValue) {
				if (!$viewValue) {
					return true;
				}
				var emailRegexp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
				if (emailRegexp.test($viewValue)) {
					return true;
				}
				else {
					return false;
				}
			}

		};
	}

})();
