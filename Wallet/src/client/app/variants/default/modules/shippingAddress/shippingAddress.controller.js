(function() {
	'use strict';

	/**
	 * @module controller: shippingAddress
	 * @description Controls shippingAddress view behavior and model.
	 * @story S4672 - Add Shipping Address
	 * @storyLink https://rally1.rallydev.com/#/46772663622d/detail/userstory/46772690912
	 * @story S5406 - Shipping address not supported by merchant
	 * @storyLink https://rally1.rallydev.com/#/46772663622d/detail/userstory/46772690928
	 */

	angular
		.module('shippingAddress')
		.controller('ShippingAddressController', ShippingAddressController);

	/* @ngInject */
	/* jshint maxparams: 11 *//* ok to inject a lot */
	function ShippingAddressController($scope, $filter, validations, session,
		api, $q, countries, logger, flowstack, localeService, $stateParams) {
		/* jshint validthis: true *//* this is allowed in this instance for vm */
		var vm = this;
		var app = $scope.app;
		var countrySubDivisions = [];
		var countryCode = session.get('locale').split('-')[1] || '';
		var allowedShippingCountries = session.get('merchant.allowedShipToCountries');
		var countryList;

		vm.title = 'Shipping Address';
		vm.isAllowedShippingCountry = _.includes(allowedShippingCountries, countryCode.toUpperCase());

		/*
		 * State Parameter that decide which screen will be displayed:
		 * If it is true then "Shipping Address not supported screen"
		 * otherwise "Add Shipping address" will be displayed.
		 */
		vm.shippingAddressNotSupported = $stateParams.shippingAddressNotSupported;

		//State Parameter that indicates that shipping address is being added from verifyPayment page
		vm.addNewShippingAddress = $stateParams.addNewShippingAddress;

		/*
		 * For preventing direct Object Access in session.
		 * We have used angular.copy() to create copy of Object rather than direct accessing Object.
		 * Added this angular.copy() to Handle back button functionality.
		 */
		vm.profile = angular.copy(session.get('profile').profile);
		vm.shippingDestination = {
			address: {},
			phoneNumber: {
				countryCode: vm.profile.mobilePhone.countryCode,
				phoneNumber: vm.profile.mobilePhone.phoneNumber
			},
			name: {
				first: vm.profile.name.first,
				last: vm.profile.name.last
			}
		};

		vm.submit = submit;
		vm.goBack = goBack;
		vm.useMyBillingAddress = useMyBillingAddress;

		$scope.$on(localeService.textLoadedEventName, createFormFields);

		/*
		 * Watch on "country drop-down value"
		 * When change, it should reload the countrySubDivisions list
		 * for a new selected country
		 */
		$scope.$watch(
			'vm.shippingDestination.address.country',
			function(countryCode) {
				if (countryCode) {
					countrySubDivisions = getCountrySubDivisions(countryCode);
				}
			}
		);

		activate();

		//////////////////////

		function activate() {
			/*
			 * If current selected country is in the list of
			 * allowedShippingCountries then that country should be
			 * selected by default in country drop-down
			 */
			if (vm.isAllowedShippingCountry) {
				vm.shippingDestination.address = {
					country: countryCode.toUpperCase()
				};
			}

			//For add shipping address, show all the countries
			if (vm.addNewShippingAddress) {
				countryList = countries;
			}
			else {
				countryList = filterAllowedCountries(countries);
			}

			createFormFields();
			logger.info('Activated the Shipping Address View.');
		}

		/**
		 * @function submit
		 * @return {Object} promise
		 * @description In case of valid form submission, this function will
		 * add a shipping address to the profile shave shipping destination api
		 */
		function submit() {
			var shippingDestinationRequest = createLegacyShippingAddressRequest();

			api.request('saveShippingDestination', shippingDestinationRequest).then(shippingAddressSuccess, shippingAddressFailure);

			function shippingAddressSuccess(shippingAddressData) {
				//session.set('shippingDestination', shippingAddressData.shippingDestination);
				session.set('shippingDestination.id', shippingAddressData.shippingDestination.id);
				flowstack.next();
			}

			function shippingAddressFailure(shippingAddressError) {
				logger.error('add shipping address failed', shippingAddressError);
			}
		}

		/**
		 * @function createLegacyShippingAddressRequest
		 * @description call the legacy shipping destination with its requirements
		 * */
		function createLegacyShippingAddressRequest() {
			var shippingRequest = {
				address: {
					country: vm.shippingDestination.address.country,
					countrySubdivision: vm.shippingDestination.address.countrySubdivision,
					line1: vm.shippingDestination.address.line1,
					city: vm.shippingDestination.address.city
				},
				phoneNumber: {
					countryCode: '1',
					phoneNumber: vm.shippingDestination.phoneNumber.phoneNumber
				},
				preferred: true
			};

			return shippingRequest;
		}

		/*
		* @function goBack
		* @description Clicking this button will cancel the add address flow and will return the user to the
		* verify payment page. The address won't be added.
		*/
		function goBack() {
			//verifyPayment is the last state on the flow and also the fallback state, so doing next will go back
			flowstack.next();
		}

		/**
		 * @function useMyBillingAddress
		 * @description In case of clicking use my billing address link this function will be called & assign
		 * billing address as shipping address & submit data to server.
		 * @returns {Object} Promise Object
		 */
		function useMyBillingAddress() {
			vm.shippingDestination.address = session.get('profile.billingAddress');
			return submit();
		}

		/**
		 * @function getCountrySubDivisions
		 * @description Get country division based on the passed country code.
		 * @param {String} countryCode Country code
		 * @returns {Array}
		 */
		function getCountrySubDivisions(countryCode) {
			var defer = $q.defer();
			api.request('countrySubDivision', {countryCode: countryCode.toUpperCase()})
				.then(success, fail);

			function success(response) {
				defer.resolve(response.countrySubdivisions);
			}

			function fail() {
				defer.reject();
			}

			return defer.promise;
		}

		/**
		 * @function filterAllowedCountries
		 * @description Filters countries to those allowed to be shipped to.
		 * @param {Array} countries Countries array object which needs to convert into bindable array.
		 * @returns {Array}
		 */
		function filterAllowedCountries(countries) {
			return _.filter(countries, function(country) {
				return _.contains(allowedShippingCountries, country.code);
			});
		}

		/**
		 * @function createFormFields
		 * @description This will assign form fields for Shipping Address
		 * formly form. We can add new fields here as per requirement.
		 */
		function createFormFields() {
			vm.fields = [
				{
					key: 'address.country',
					type: 'selectWithPlaceholder',
					name: 'countries',
					templateOptions: {
						placeholder: app.text.countryPlaceholder,
						options: countryList,
						valueProp: 'code',
						labelProp: 'name',
						focus: true
					},
					validators: {
						required: {
							expression: validations.required,
							message: app.text.requiredField
						}
					}
				},
				{
					className: 'row',
					fieldGroup: [
						{
							className: 'col-sm-6 col-xs-12',
							key: 'name.first',
							name: 'first',
							type: 'input',
							templateOptions: {
								placeholder: app.text.firstNamePlaceholder
							},
							validators: {
								max: {
									expression: validations.firstNameMaxValidator,
									message: app.text.maxFirstNameLength
								},
								min: {
									expression: validations.firstNameMinValidator,
									message: app.text.minFirstNameLength
								},
								required: {
									expression: validations.required,
									message: app.text.requiredField
								}
							}
						},
						{
							className: 'col-sm-6 col-xs-12',
							key: 'name.last',
							name: 'last',
							type: 'input',
							templateOptions: {
								placeholder: app.text.lastNamePlaceholder
							},
							validators: {
								max: {
									expression: validations.lastNameMaxValidator,
									message: app.text.maxLastNameLength
								},
								min: {
									expression: validations.lastNameMinValidator,
									message: app.text.minLastNameLength
								},
								required: {
									expression: validations.required,
									message: app.text.requiredField
								}
							}
						}
					]
				},
				{
					key: 'address.line1',
					name: 'line1',
					type: 'input',
					templateOptions: {
						placeholder: app.text.streetAddressPlaceholder
					},
					expressionProperties: {
						'templateOptions.focus': vm.isAllowedShippingCountry.toString()
					},
					validators: {
						max: {
							expression: validations.line1MaxValidator,
							message: app.text.maxLine1Length
						},
						min: {
							expression: validations.line1MinValidator,
							message: app.text.minLine1Length
						},
						required: {
							expression: validations.required,
							message: app.text.requiredField
						}
					}
				},
				{
					key: 'address.city',
					name: 'city',
					type: 'input',
					templateOptions: {
						placeholder: app.text.cityPlaceholder
					},
					validators: {
						max: {
							expression: validations.cityMaxValidator,
							message: app.text.maxCityLength
						},
						min: {
							expression: validations.cityMinValidator,
							message: app.text.minCityLength
						},
						required: {
							expression: validations.required,
							message: app.text.requiredField
						}
					}
				},
				{
					className: 'row',
					fieldGroup: [
						{
							className: 'col-sm-6 col-xs-6',
							key: 'address.countrySubdivision',
							type: 'selectWithPlaceholder',
							name: 'countrySubdivision',
							templateOptions: {
								placeholder: app.text.statePlaceholder,
								valueProp: 'code',
								labelProp: 'name'
							},
							expressionProperties: {
								'templateOptions.options': function() {
									return countrySubDivisions;
								}
							},
							validators: {
								required: {
									expression: validations.required,
									message: app.text.requiredField
								}
							}
						},
						{
							className: 'col-sm-6 col-xs-6',
							key: 'address.postalCode',
							name: 'postalCode',
							type: 'input',
							templateOptions: {
								placeholder: app.text.postalCodePlaceholder
							},
							validators: {
								max: {
									expression: validations.zipMaxValidator,
									message: app.text.maxZipLength
								},
								min: {
									expression: validations.zipMinValidator,
									message: app.text.minZipLength
								},
								required: {
									expression: validations.required,
									message: app.text.requiredField
								}
							}
						}
					]
				},
				{
					key: 'primaryShippingAddress',
					name: 'primaryShippingAddress',
					type: 'checkbox',
					templateOptions: {
						label: app.text.useAsPrimaryShippingAddress
					},
					hide: !vm.addNewShippingAddress
				},
				{
					className: 'row',
					fieldGroup: [
						{
							className: 'col-sm-12 col-xs-12',
							key: 'phoneNumber.phoneNumber',
							name: 'phoneNumber',
							type: 'input',
							templateOptions: {
								placeholder: app.text.phoneNumberPlaceholder
							},
							validators: {
								required: {
									expression: validations.required,
									message: app.text.requiredField
								},
								phoneDigit: {
									expression: validations.phoneDigitValidator,
									message: app.text.phoneValidatorError
								},
								max: {
									expression: validations.phoneNumberMaxValidator,
									message: app.text.maxPhoneNumberLength
								},
								min: {
									expression: validations.phoneNumberMinValidator,
									message: app.text.minPhoneNumberLength
								}
							}
						}
					]
				}
			];
		}
	}
})();
