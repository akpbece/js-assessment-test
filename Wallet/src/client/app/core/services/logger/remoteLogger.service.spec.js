describe('Remote Logger Factory:', function() {
	var remoteLoggerFactory, http;

	beforeEach(function() {
		module('core.logger');
	});

	beforeEach(inject(function(_remoteLogger_, $http) {
		remoteLoggerFactory = _remoteLogger_;
		http = $http;
	}));

	it('should create a remote logger factory', function() {
		expect(remoteLoggerFactory).to.be.defined;
	});

	it('should use angular `$http` service when remoteLogger post method is called', function() {
		var postStub = sinon.stub(http, 'post');

		remoteLoggerFactory.post('http://www.jquery.com', '{data: "myAwesomeData"}');
		expect(postStub).to.have.been.calledOnce;

		postStub.restore();
	});

});
