(function() {
	'use strict';

	/**
	 * @module controller: RegistrationConfirmationController
	 * @description showing congratulations page, updating profile info. & remember user name.
	 * @story S3596 - Offers Opt In & Remember username on Congratulations page
	 * @storyLink https://rally1.rallydev.com/#/46772663622d/detail/userstory/46772704622
	 * @story S9276 - Wallet: Implement "Remember Me" for Congratulations Page (RBA+Username cookie)
	 * @storyLink https://rally1.rallydev.com/#/46772663622d/detail/userstory/48284123239
	 */
	angular
		.module('registrationConfirmation')
		.controller('RegistrationConfirmationController', RegistrationConfirmationController);

	/* @ngInject */
	function RegistrationConfirmationController(
		$scope,
		$q,
		logger,
		localeService,
		api,
		postMsg,
		session,
		$interpolate,
		checkout
	) {
		// jshint validthis: true
		var vm = this;
		var app = $scope.app;

		vm.title = 'Registration Confirmation';

		// "Remember User Name" checkbox should be selected by default.
		vm.confirmationModel = {
			rememberUserName: true
		};

		/**
		 * This get's triggered when continue button is clicked on registration
		 * page
		 */
		vm.continueCheckout = continueCheckout;

		$scope.$on(localeService.textLoadedEventName, onLocaleChange);

		activate();

		/////////////////////////////

		/**
		 * @function activate
		 * @description  This function gets automatically gets called when
		 * the controller initializes
		 */
		function activate() {
			createFormFields();
			interpolateMerchantName();
			logger.info('Activated Registration Confirmation View.');
		}

		/**
		 * @function onLocaleChange
		 * @description This function will be called when locale is changed.
		 */
		function onLocaleChange() {
			interpolateMerchantName();
			createFormFields();
		}

		// TODO: Rethink how we need to do this app wide
		function interpolateMerchantName() {
			var text = $interpolate(app.text.checkoutConfirmationContinue);
			app.text.checkoutConfirmationContinue = text({merchant: '<strong>' + session.get('merchant.name') + '</strong>'});
		}

		/**
		 * @function optInReceiveEmailNotification
		 * @description This will update user's profile preference to
		 * receive email notification to true.  We dont care if this fails
		 * and resolve anyway.
		 * @return {Object} Returns a promise
		 */
		function optInReceiveEmailNotification() {
			var defer = $q.defer();
			var updatedProfile = session.get('profile').profile;
			updatedProfile.preferences.receiveEmailNotification = true;

			/**
			 * @function updateProfileSuccess
			 * @description Resolves the promise with response data
			 * @param  {Object} response The response Object
			 */
			function updateProfileSuccess(response) {
				defer.resolve(response);
				logger.info('profile is successfully updated for keep me posted for MasterPass offers.');
			}

			/**
			 * @function updateProfileFailure
			 * @description Just resolve the deferred object then use the
			 * logger error to log information so we can better debug future
			 * problem
			 * @param  {Object} error Error Object
			 */
			function updateProfileFailure(error) {
				// we dont care if it fails, we still resolve to allow checkout to continue
				defer.resolve(error);
				logger.error('error while updating profile.', error);
			}

			api.request('updateProfile', updatedProfile)
				.then(updateProfileSuccess, updateProfileFailure);

			return defer.promise;
		}

		/**
		 * @function optInRememberUserName
		 * @description This will update user's profile preference to
		 * remember user name to true
		 * @return {Object} Returns a promise
		 */
		function rememberUser() {
			var defer = $q.defer();

			var rememberUserRequest = {
				rememberUserName: vm.confirmationModel.rememberUserName,
				deviceFingerprint: session.get('fingerprint')
			};

			/**
			 * @function rememberUserNameSuccess
			 * @description Resolves the promise with response data
			 * @param  {Object} response The response Object
			 */
			function rememberUserSuccess(response) {
				defer.resolve(response);
				if (vm.confirmationModel.rememberUserName) {
					logger.info('username is remembered successfully and RBA is established.');
				} else {
					logger.info('username is not remembered but RBA is established.');
				}
			}

			/**
			 * @function rememberUserNameFailure
			 * @description Just resolve the deferred object then use the
			 * logger error to log information so we can better debug future
			 * problem
			 * @param  {Object} error Error Object
			 */
			function rememberUserFailure(error) {
				// we dont care if it fails, we still resolve to allow checkout to continue
				defer.resolve(error);
				logger.error('error while remembering username.', error);
			}

			api.request('rememberUserName', rememberUserRequest)
				.then(rememberUserSuccess, rememberUserFailure);

			return defer.promise;
		}

		/**
		 * @function continueCheckout
		 * @description This function is called when continue button will be clicked from congratulations page.
		 * It will call API to update profile, remember my username, selections & checkout.
		 */
		function continueCheckout() {
			var requests = [];
			var checkoutRequest = {
				'shippingDestinationId': session.get('shippingDestination.id'),
				'paymentCardId': session.get('paymentCard.id')
			};

			requests.push(checkout.doCheckout(checkoutRequest));

			// always fingerprint the user, but only remember their name if they click the checkbox
			requests.push(rememberUser());

			// if user has checked "Keep me updated for MasterPass offers"
			// then add update profile to list of apis to call
			if (vm.confirmationModel.receiveEmailNotification) {
				requests.push(optInReceiveEmailNotification());
			}

			// Handle checkout call once resolved all requests in stack.
			$q.all(requests).then(function(results) {
				var checkoutData = results[0];
				var message = {
					mpstatus: 'success',
					merchantCallbackUrl: (checkoutData.merchantCallbackUrl || null),
					verifyToken: (checkoutData.verifierToken || null),
					checkoutResourceUrl: (checkoutData.checkoutResourceUrl || null)
				};
				postMsg.send('completeCheckout', message);

			}).catch(function(errors) {
				// TODO: should accept rejections from other promises and only fail if checkout rejects
				logger.error('errors in promises', errors);
			});
		}

		/**
		 * @function createFormFields
		 * @description This function will assign form fields to Registration Confirmation formly form.
		 */
		function createFormFields() {
			vm.fields = [
				{
					key: 'rememberUserName',
					name: 'rememberUserName',
					type: 'confirmationCheckbox',
					templateOptions: {
						label: app.text.registrationConfirmationRememberMyUsername,
						learnmore: app.text.registrationConfirmationLink
					}
				}
			];

			// Fields that are outside of the confirmation panel
			vm.outerFields = [
				{
					className: 'text-center',
					key: 'receiveEmailNotification',
					name: 'receiveEmailNotification',
					type: 'checkbox',
					templateOptions: {
						label: app.text.registrationConfirmationKeepMeUpdated
					}
				}
			];
		}
	}
})();
