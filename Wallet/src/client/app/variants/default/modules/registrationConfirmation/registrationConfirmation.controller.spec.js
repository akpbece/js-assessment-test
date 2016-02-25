/* jshint -W117, -W030 */

describe('Registration Confirmation Controller', function() {
	var controller, sandbox, scope;

	beforeEach(function() {
		bard.appModule('registrationConfirmation');
		bard.inject(
			'$controller',
			'$rootScope',
			'api',
			'postMsg',
			'$q',
			'session',
			'$window',
			'$timeout',
			'logger'
		);

		scope = $rootScope.$new();
		scope.app = {
			'text': {
				'checkoutConfirmationContinue': 'Return to {{merchant}} Page'
			}
		};

		scope.vm = controller;

		session.set('oauthToken', '27c7cb3a-0466-4c51-8bb9-71490f432e89');
		session.set('fingerprint', '1e60020b515451d66a1c48c52a61fa0e');
		session.set('profile', {
			profile: {
				preferences: {
					receiveMobileNotification: false,
					receiveEmailNotification: true,
					personalizationOptIn: false
				}
			}
		});
		session.set('merchant', {
			'checkoutVersion': '6',
			'requestedFlow': 'checkout',
			'allowedCardTypes': 'master,amex,diners,discover,maestro,visa',
			'requireShippingDestination': 'true',
			'callbackUrl': 'demo/merchant-callback.html',
			'clientOrigin': 'http://localhost:3000',
			'targetOrigin': 'http://localhost:3000',
			'parametersId': '3j011-buhyp9-ik8lavmu-1-ik9x8uax-55v',
			'allowedShipToCountries': [
			'US'
			],
			'name': 'JCrew',
			'cardinalMerchantId': '4',
			'authOptions': 'NO_3DS'
		});

		sandbox = sinon.sandbox.create();

		postMsg.config($window, 'http://mastercard.com', 'http://mastercard.com');

		controller = $controller('RegistrationConfirmationController', {
			$scope: scope
		});
	});

	afterEach(function() {
		sandbox.restore();
	});

	bard.verifyNoOutstandingHttpRequests();

	it('should be created successfully', function() {
		expect(controller).to.be.defined;
	});

	describe('after activate', function() {
		it('should have title of registrationConfirmation', function() {
			expect(controller.title).to.equal('Registration Confirmation');
		});
		it('should have an activate method', function() {
			expect(controller.activate).isFunction;
		});
		it('should have createFormFields method', function() {
			expect(controller.createFormFields).isFunction;
		});
		it('should have defined the form fields', function() {
			expect(controller.fields).to.be.defined;
			expect(controller.outerFields).to.be.defined;
		});
		it('should have used custom fromly checkbox', function() {
			expect(controller.fields[0].type).to.equal('confirmationCheckbox');
			expect(controller.outerFields[0].type).to.equal('checkbox');
		});
	}); // end 'after activate'

	describe('Consumer has clicked on Continue Checkout ---', function() {

		var selectionsResponse = {
			addCheckoutSelectionsResponse: {
				precheckoutTransactionId: '1234-5678-9012'
			}
		};
		var checkoutResponse = {
			checkout: {}
		};

		beforeEach(function() {
			sandbox.stub(api, 'request', function(args) {
				var response = selectionsResponse;
				if (args === 'checkout') {
					response = checkoutResponse;
				}

				return $q.when(response);
			});

			postMsgStub = sandbox.stub(postMsg, 'send');
		});

		it('should post to update profile, rememberUserName, selection and checkout endpoints' +
			' if user has opt-in for email notification and for remember user name', function() {
			controller.confirmationModel = {
				receiveEmailNotification: true,
				rememberUserName: true
			};
			controller.continueCheckout();
			scope.$apply();

			expect(api.request).to.have.been.called;
			expect(api.request).to.have.been.calledWith('updateProfile', {
				preferences: {
					personalizationOptIn: false,
					receiveEmailNotification: true,
					receiveMobileNotification: false
				}
			});
			expect(api.request).to.have.been.calledWith('rememberUserName', {
				deviceFingerprint: '1e60020b515451d66a1c48c52a61fa0e',
				rememberUserName: true
			});
			expect(api.request).to.have.been.calledWith('selections');
			expect(api.request).to.have.been.calledWith('checkout');
			expect(postMsgStub).to.have.been.calledOnce;
		});

		it('should post to update profile, selection and checkout endpoints ' +
			'if user has opt-in for email notification and ' +
			'opt-out for remember user name', function() {
			controller.confirmationModel = {
				receiveEmailNotification: true,
				rememberUserName: false
			};
			controller.continueCheckout();
			scope.$apply();

			expect(api.request).to.have.been.calledWith('rememberUserName', {
				deviceFingerprint: '1e60020b515451d66a1c48c52a61fa0e',
				rememberUserName: false
			});
			expect(api.request).to.have.been.calledWith('updateProfile', {
				preferences: {
					personalizationOptIn: false,
					receiveEmailNotification: true,
					receiveMobileNotification: false
				}
			});
			expect(api.request).to.have.been.calledWith('selections');
			expect(api.request).to.have.been.calledWith('checkout');
			expect(postMsgStub).to.have.been.calledOnce;
		});

		it('should post to rememberUserName, selection and checkout endpoints ' +
			'if user has opt-in for remember user name and opt-out for email notification', function() {
			controller.confirmationModel = {
				receiveEmailNotification: false,
				rememberUserName: true
			};
			controller.continueCheckout();
			scope.$apply();

			expect(api.request).to.have.been.calledThrice;
			expect(api.request).to.have.been.calledWith('rememberUserName', {
				deviceFingerprint: '1e60020b515451d66a1c48c52a61fa0e',
				rememberUserName: true
			});
			expect(api.request).to.have.been.calledWith('selections');
			expect(api.request).to.have.been.calledWith('checkout');
			expect(postMsgStub).to.have.been.calledOnce;
		});

		it('should post to selection and checkout endpoint if user has opt-out ' +
			'for email notification and for remember my username', function() {
			controller.confirmationModel = {
				receiveEmailNotification: false,
				rememberUserName: false
			};
			controller.continueCheckout();
			scope.$apply();

			expect(api.request).to.have.been.calledWith('rememberUserName', {
				deviceFingerprint: '1e60020b515451d66a1c48c52a61fa0e',
				rememberUserName: false
			});
			expect(api.request).to.have.been.calledWith('selections');
			expect(api.request).to.have.been.calledWith('checkout');
			expect(postMsgStub).to.have.been.calledOnce;
		});

		it('should not call API calls for all endpoints as we are getting 404 in response', function() {
			sandbox.restore();
			sandbox = sinon.sandbox.create();
			sandbox.stub(api, 'request', function() {
				return $q.reject({
					responseCode: 404
				});
			});

			controller.confirmationModel = {
				receiveEmailNotification: true,
				rememberUserName: true
			};
			controller.continueCheckout();
			scope.$apply();

			expect(api.request).to.be.calledThrice;
		});

		describe('$q service', function() {
			beforeEach(function() {
				sandbox.stub($q, 'all', function() {
					return $q.reject(new Error('bad request'));
				});
				sandbox.stub(logger, 'error');
			});
			it('should call logger\'s error method on a fail $q all', function() {
				controller.continueCheckout();
				scope.$apply();

				expect(logger.error).to.have.been.calledOnce;
				expect(logger.error).to.have.been.calledWith('errors in promises');
			});
		});

	}); // end 'continueCheckout method'

	describe('locale changes should be broadcast properly', function() {
		it('should create form fields', function() {
			scope.$broadcast('TextLoaded');

			expect(controller.fields).to.exist;
			expect(controller.fields).to.be.an.array;

			expect(controller.outerFields).to.exist;
			expect(controller.outerFields).to.be.an.array;
		});
	});

});
