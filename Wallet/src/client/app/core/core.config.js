(function() {
	'use strict';

	angular.module('app.core')
		.config(configure);

	/* @ngInject */
	function configure($logProvider, formlyConfigProvider/*, forgeformsFormlyProvider*/) {

		if ($logProvider.debugEnabled) {
			$logProvider.debugEnabled(true);
		}

		// TODO: uncomment once wallet wrappers are migrated into forgeforms
		// set a list of wrappers from the common shared forgeforms component
		// formlyConfigProvider
		// 	.setWrapper(forgeformsFormlyProvider.getWrappers());

		formlyConfigProvider.setWrapper({
			name: 'validation',
			types: ['input', 'select', 'selectWithPlaceholder', 'passwordWithInfoField','checkbox'],
			templateUrl: 'app/partials/fieldValidationMessage.html'
		});

		// TODO: uncomment once wallet types are migrated into forgeforms
		// set a list of types from the common shared forgeforms component
		// formlyConfigProvider
		// 	.setType(forgeformsFormlyProvider.getTypes());

		formlyConfigProvider.setType({
			name: 'password-strength',
			templateUrl: 'app/partials/passwordStrength.html'
		});

		formlyConfigProvider.setType({
			name: 'selectWithPlaceholder',
			templateUrl: 'app/partials/selectWithPlaceholder.html',
			wrapper: ['bootstrapLabel', 'bootstrapHasError']
		});

		formlyConfigProvider.setType({
			name: 'confirmationCheckbox',
			templateUrl: 'app/partials/confirmationCheckbox.html'
		});

		formlyConfigProvider.setType({
			name: 'passwordWithInfoField',
			templateUrl: 'app/partials/passwordWithInfoField.html',
			wrapper: ['bootstrapLabel', 'bootstrapHasError']
		});

		formlyConfigProvider.setType({
			name: 'rememberMeWithLearnMore',
			templateUrl: 'app/partials/rememberMeWithLearnMore.html',
			wrapper: ['bootstrapLabel', 'bootstrapHasError']
		});

	}

})();
