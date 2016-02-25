/**
 * Good read on how to test config
 * https://medium.com/@a_eife/testing-config-and-run-blocks-in-angularjs-1809bd52977e
 */

describe('App Core --- Config', function() {
	var $logProvider, logProviderSpy;

	it('should exist', function() {
		expect($logProvider).to.be.defined;
	});

	describe('When `$logProvider debugEnabled` exist or truthy', function() {
		beforeEach(function() {
			module(function(_$logProvider_) {
				logProviderSpy = sinon.spy(_$logProvider_, 'debugEnabled');
				$logProvider = _$logProvider_;
			});

			module('app.core');
			inject();
		});

		afterEach(function() {
			logProviderSpy.restore();
		});

		it('should created successfully', function() {
			expect($logProvider).to.be.defined;
		});

		it('should call `debugEnabled` method with true argument', function() {
			expect(logProviderSpy).to.be.have.been.called;
			expect(logProviderSpy).to.be.have.been.calledWith(true);
		});
	});

	describe('When `$logProvider debugEnabled` method is falsy', function() {
		beforeEach(function() {
			module(function(_$logProvider_) {
				logProviderSpy = sinon.spy(_$logProvider_, 'debugEnabled');

				$logProvider = _$logProvider_;
				$logProvider.debugEnabled = false;
			});

			module('app.core');
			inject();
		});

		afterEach(function() {
			logProviderSpy.restore();
		});

		it('should call `debugEnabled` method', function() {
			expect(logProviderSpy).to.be.have.not.been.called;
			expect(logProviderSpy).to.be.have.not.been.calledWith(true);
		});
	});

});
