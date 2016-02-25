/**
 * Nice tutorial on stubbing a promise
 * http://juristr.com/blog/2015/06/learning-ng-testing-promises/
 */

describe('Checkout Factory:', function() {
	var api, $q, sandbox, checkout, session;

	beforeEach(function() {
		module('app.core');
		module('core.checkout');
	});

	beforeEach(inject(function(_api_, _$q_, _checkout_, _session_) {
		api = _api_;
		$q = _$q_;
		checkout = _checkout_;
		session = _session_;

		sandbox = sinon.sandbox.create();
	}));

	afterEach(function() {
		sandbox.restore();
	});

	it('should exist', function() {
		expect(checkout).to.exist;
	});

	describe('`doCheckout` method', function() {
		it('should send a selection request', function() {
			var request = {
				'shippingDestinationId': 'abcd1234',
				'paymentCardId': '1234abcd'
			};
			var response = {
				'merchant': {
					'checkoutId': 123,
					'checkoutVersion': 'v5'
				}
			};

			session.set('merchant.checkoutId', '123');
			session.set('merchant.checkoutVersion', 'v6');
			session.set('oauthToken', '7891237sdf89');

			sandbox.stub(api, 'request', function() {
				return $q.when(response);
			});

			checkout.doCheckout(request);

			expect(api.request).to.have.been.calledOnce;
			expect(api.request).to.have.been.calledWith('selections');
		});

	});

	// TODO: test checkout call too

});
