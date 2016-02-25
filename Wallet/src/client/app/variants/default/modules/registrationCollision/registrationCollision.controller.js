(function() {
	'use strict';

	/**
	 * @module controller: registrationCollision
	 * @description User enters a new email/phone number as username on
	 * the Email or Phone Entry screen 1.0 They then enter an the other
	 * of email/phone number on Billing Info and Password Screen.  If
	 * that second credential is already in use by another account in
	 * that wallet they are shown this Registration Warning screen to
	 * provide consumer the option to continue to register a new wallet
	 * with different seconday credential, or to sign into their
	 * existing account.
	 *
	 * TODO : Currently this only will work for the profile info in wallet,
	 * this is probably not a good long term assumption, and we should make this
	 * work with the switch information as well, there is still some discussion here
	 * as to how the services will throw exceptions and work with user collisions.
	 */

	angular
		.module('registrationCollision')
		.controller('RegistrationCollisionController', RegistrationCollisionController);

	/* @ngInject */
	function RegistrationCollisionController(logger, $scope, flowstack, $stateParams,
		localeService, $timeout, $interpolate, session) {
		/* jshint validthis: true */
		var vm = this;
		var app = $scope.app;
		var userInformationForm = session.get('form.userInformation');
		var secondaryCredentialType = $stateParams.secondaryCredentialType;

		// Based on secondary credential type, It will get
		// duplicated phone/email value from profile Object.
		var secondaryCredentialValue =
			(secondaryCredentialType === 'email') ?
				userInformationForm.contactDetails.emailAddress : userInformationForm.contactDetails.mobilePhone.phoneNumber;

		vm.title = 'Registration Collision';
		vm.signIntoExistingAccount = signIntoExistingAccount;
		vm.registerUsingNewUsername = registerUsingNewUsername;

		$scope.$on(localeService.textLoadedEventName, updateSecondaryCredentialTypeText);

		activate();

		////////////////

		function activate() {
			logger.info('Activated the Registration Warning View.');
			updateSecondaryCredentialTypeText();
		}

		/**
		 * @function updateSecondaryCredentialTypeText
		 * @description Parsing of "Variable name contained message" with Dynamic value.
		 * (e.g Register Using New {{secondaryCredentialType}} to Register Using New Phone/Email)
		 */
		function updateSecondaryCredentialTypeText() {
			$timeout(function() {
				var textKeys = [
					'signInWithExistingSecondaryCredential',
					'registerUsingNewSecondaryCredential',
					'registrationCollisionContent1'
				];
				_.each(textKeys, function(val) {
					var text = $interpolate(app.text[val]);
					app.text[val] = text({secondaryCredentialType: secondaryCredentialType});
				});
			});
		}

		/**
		 * @function signIntoExistingAccount
		 * @description When a consumer clicks the "Sign-In to Existing [Secondary Data] Account"
		 * then the consumer will be taken to the Recognize Sign-In Specific Wallet screen 3.1
		 */
		function signIntoExistingAccount() {
			session.set('username', secondaryCredentialValue);
			flowstack.use('signin').next();
		}

		/**
		 * @function registerUsingNewUsername
		 * @description When a consumer clicks the "Register Using New  [Secondary Data]"
		 * then the consumer will be taken back to the Capture Billing Info & Password screen
		 * with the Phone Number/Email having a field level error.
		 */
		function registerUsingNewUsername() {
			flowstack.add('userInformation');
			flowstack.next({
				duplicate: secondaryCredentialType
			});
		}

	}
})();
