/* jshint -W117, -W030 */
describe('Verify Payment Controller', function() {
	var controller, controller2, scope, sandbox, apiStub;

	// trim test data down - todo
	var apiSuccessResponse = {
		'paymentCards': [{
			'address': {
				'country': 'US',
				'city': 'Forest Hills',
				'postalCode': null,
				'line1': '123 St',
				'line2': null,
				'countrySubdivision': null
			},
			'id': '8f7087bd-d88d-482b-a373-99940de5073c',
			'ref': null,
			'alias': '',
			'preferred': true,
			'phoneNumber': {
				'countryCode': 'US+1',
				'phoneNumber': '4781930465'
			},
			'securityCode': null,
			'accountNumber': null,
			'cardholderName': 'Angelo Miranda',
			'expiryMonth': '12',
			'expiryYear': '2041',
			'cardBrand': {
				'name': 'Mastercard',
				'code': 'master'
			},
			'maskedAccountNumber': '••••••••••••0040'
		}],
		'shippingDestinations': [{
			'address': {
				'country': 'US',
				'city': 'Forest Hills',
				'postalCode': '11375',
				'line1': '123 St',
				'line2': null,
				'countrySubdivision': 'NH'
			},
			'id': '51007168-56e3-458d-b4a0-b4f273629b81',
			'preferred': true,
			'phoneNumber': {
				'countryCode': '1',
				'phoneNumber': '4781930465'
			},
			'recipientName': 'Angelo Miranda',
			'directProvisionedSwitch': false
		}]
	};

	beforeEach(function() {
		bard.appModule('verifyPayment');
		bard.inject(
			'$controller',
			'logger',
			'session',
			'api',
			'$rootScope',
			'$q',
			'$timeout',
			'$interpolate',
			'postMsg',
			'checkout'
		);

		session.set('merchant.allowedCardTypes', 'master,visa,discover,amex,jcb,diner');
		session.set('merchant.name', 'Unit Test Merchant');

		scope = $rootScope.$new();
		scope.app = {text: {
			checkoutConfirmationContinue: 'Return to {{merchant}} page'
		}};
		sandbox = sinon.sandbox.create();

		apiStub = sandbox.stub(api, 'request', function() {
			return $q.when(apiSuccessResponse);
		});

		postMsg.config(window, 'http://www.mastercard.com', 'http://www.mastercard.com');

		//sandbox.stub(postMsg, 'send', function() {
		//	return $q.when({
		//		name: 'JCrew'
		//	});
		//});

		sandbox.stub(logger, 'info');

		controller = $controller('VerifyPaymentController', {
			$scope: scope
		});
	});

	afterEach(function() {
		sandbox.restore();
	});

	bard.verifyNoOutstandingHttpRequests();

	describe('When the controller is initialized', function() {
		beforeEach(function() {
			scope.$apply();
		});

		it('should be created successfully', function() {
			expect(controller).to.be.defined;
		});

		it('should call payment card and shipping destination API calls', function() {
			expect(apiStub).to.be.called;
			expect(apiStub).to.be.calledWith('getPaymentCard');
		});

		describe('When the controller calls activate method', function() {
			it('should call activate info', function() {
				expect(logger.info).to.be.calledOnce;
				expect(logger.info).to.be.calledWith('Activated the Verify Payment View.');
			});
		});

		describe('setMerchantAcceptedCard method', function() {
			it('should return the first 4 cc from merchant accepted cc', function() {
				expect(controller.merchantAcceptedCC).to.be.an.array;
				expect(controller.merchantAcceptedCC).to.be.deep.equal(['master','visa','discover','amex']);
			});
		});

		describe('setPrefPaymentCard method', function() {
			it('should save preferred response to controller\'s prefPayment method', function() {
				expect(controller.prefPaymentMethod).to.exist;
				expect(controller.prefPaymentMethod).to.be.an.object;
			});
		});

		describe('When api request fails', function() {
			var controller2;

			it('should call logger error to display error message', function() {
				// Restore api again so I can stub it again on a new
				// controller I am going to create below
				apiStub.restore();

				sandbox.stub(api, 'request', function() {
					return $q.reject();
				});

				sandbox.stub(logger, 'error');

				controller2 = $controller('VerifyPaymentController', {
					$scope: scope
				});

				scope.$apply();

				expect(logger.error).to.be.called;
				expect(logger.error).to.be.calledWith('Verify Payment Error: ');
			});
		});
	});

	describe('continueCheckout method', function() {
		beforeEach(function() {
			apiStub.restore();
			sandbox.stub(api, 'request', function() {
				return $q.when({
					'addCheckoutSelectionsResponse': {
						'precheckoutTransactionId': 'e7a621bc-4594-43ef-b2e6-22cfb373bac7'
					},
					'checkout': '123 checkout data'
				});
			});
			sandbox.stub(checkout, 'doCheckout', function() {
				return $q.when({
					checkout: {
						merchantCallbackUrl: 'http://www.yahoo.com',
						verifierToken: '1234-sdfj-0491-data'
					}
				});
			});
			sandbox.stub(postMsg, 'send');
		});

		it('should checkout successfully', function() {
			controller.continueCheckout();
			scope.$apply();

			expect(checkout.doCheckout).to.have.been.called;
			expect(postMsg.send).to.have.been.called;
		});
		it('should checkout successfully', function() {
			controller.suppressShippingAddress = true;
			controller.continueCheckout();
			scope.$apply();

			expect(postMsg.send).to.have.been.called;
			expect(postMsg.send).to.have.been.calledWith('completeCheckout');
		});

		it('should log error msg when checkout call fails', function() {
			checkout.doCheckout.restore();
			sandbox.stub(checkout, 'doCheckout', function() {
				return $q.reject();
			});
			sandbox.stub(logger, 'error');

			controller.continueCheckout();
			scope.$apply();

			expect(logger.error).to.have.been.calledOnce;
			expect(logger.error).to.have.been.calledWith('Verify Payment Error: ');
		});
	});

	describe('getShippingDestination method', function() {
		beforeEach(function() {
			var response = {
				'shippingDestinations': [{
					name: 'Angelo',
					address: {
						line1: 123
					},
					preferred: false
				}, {
					name: 'Angelina Jolie',
					address: {
						line1: 123
					},
					preferred: true
				},{
					name: 'Brad Pitt',
					address: {
						line1: 123
					},
					preferred: false
				}
			]};
			apiStub.restore();
			sandbox.stub(api, 'request', function() {
				return $q.when(response);
			});

			controller.getShippingDestination();
			scope.$apply();

		});

		it('should getShippingDestination', function() {
			expect(api.request).to.have.been.calledOnce;
			expect(api.request).to.have.been.calledWith('getShippingDestination');
		});
		it('should sort shipping address', function() {
			var sortedArray = [{
				'name': 'Angelina Jolie',
				'address': {
					'line1': 123
				},
				'preferred': true
			}, {
				'name': 'Angelo',
				'address': {
					'line1': 123
				},
				'preferred': false
			}, {
				'name': 'Brad Pitt',
				'address': {
					'line1': 123
				},
				'preferred': false
			}];

			expect(controller.shippingAddresses).to.be.an.array;
			expect(controller.shippingAddresses).to.have.length(3);
			expect(controller.shippingAddresses).to.be.deep.equal(sortedArray);
		});
		it('should keep the preferred shipping', function() {
			var preferredShipping = {
				'name': 'Angelina Jolie',
				'address': {
					'line1': 123
				},
				'preferred': true
			};

			expect(controller.selectedShippingAddress).to.be.deep.equal(preferredShipping);
		});
	});

	describe('When the controller is initialized with suppressShippingAddress', function() {
		beforeEach(function() {
			session.set('merchant.suppressShippingAddress', 'true');
			controller2 = $controller('VerifyPaymentController', {
				$scope: scope
			});
			scope.$apply();

			apiStub.restore();
			sandbox.stub(api, 'request', function() {
				return $q.when({
					'addCheckoutSelectionsResponse': {
						'precheckoutTransactionId': 'e7a621bc-4594-43ef-b2e6-22cfb373bac7'
					},
					'checkout': '123 checkout data'
				});
			});
		});

		it('should checkout successfully', function() {
			sandbox.stub(checkout, 'doCheckout', function() {
				return $q.when({
					checkout: {
						merchantCallbackUrl: 'http://www.yahoo.com',
						verifierToken: '1234-sdfj-0491-data'
					}
				});
			});
			controller.continueCheckout();
			scope.$apply();
			expect(checkout.doCheckout).to.have.been.called;
		});

		it('should not fail on empty checkout response', function() {
			sandbox.stub(checkout, 'doCheckout', function() {
				return $q.when({
					checkout: {}
				});
			});
			controller.continueCheckout();
			scope.$apply();
			expect(checkout.doCheckout).to.have.been.called;
		});

	});
});
