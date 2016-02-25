var REMOTE_PATH = '/remote/endpoint';

describe('Logger Factory:', function() {
	var logger,
		$log,
		remoteLogger;

	beforeEach(module('core.logger'));

	beforeEach(inject(function(
		_logger_,
		_$log_,
		_remoteLogger_
	) {
		logger = _logger_;
		$log = _$log_;
		remoteLogger = _remoteLogger_;
	}));

	it('should exist', function() {
		expect(logger).to.exist;
	});

	describe('Logger properties', function() {
		it('should have `init` property', function() {
			expect(logger).to.have.property('init');
		});
		it('should have `info` property', function() {
			expect(logger).to.have.property('info');
		});
		it('should have `error` property', function() {
			expect(logger).to.have.property('error');
		});
		it('should have `debug` property', function() {
			expect(logger).to.have.property('debug');
		});
		it('should have `warning` property', function() {
			expect(logger).to.have.property('warning');
		});
		it('should have `log` property', function() {
			expect(logger).to.have.property('log');
		});
	});

	describe('Logger `processConsoleMessage` method', function() {
		// Logger Debug Test
		it('should call logger debug when remotelevel is set to `debug`', function() {
			var consoleLevels = 'debug';
			var remoteLevels = 'debug';
			sinon.spy($log, 'debug');
			logger.init(consoleLevels, remoteLevels, REMOTE_PATH);
			logger.debug('Debugging', 'data', 'Debugging Title');
			expect($log.debug).to.have.been.calledOnce;
		});
		it('should not call logger debug when remotelevel is not set to `debug`', function() {
			var consoleLevels = 'info,warning,error';
			var remoteLevels = 'info,warning,error';
			sinon.spy($log, 'debug');
			logger.init(consoleLevels, remoteLevels, REMOTE_PATH);
			logger.debug('Debugging', 'data', 'Debugging Title');
			expect($log.debug).to.have.not.been.calledOnce;
		});

		// Logger Info Test
		it('should call logger info when remotelevel is set to `info`', function() {
			var consoleLevels = 'info';
			var remoteLevels = 'info';
			sinon.spy($log, 'info');
			logger.init(consoleLevels, remoteLevels, REMOTE_PATH);
			logger.info('Info', 'data', 'Info Title');
			expect($log.info).to.have.been.calledOnce;
		});
		it('should not call logger info when remotelevel is not set to `info`', function() {
			var consoleLevels = 'error,warning,debug';
			var remoteLevels = 'error,warning,debug';
			sinon.spy($log, 'info');
			logger.init(consoleLevels, remoteLevels, REMOTE_PATH);
			logger.info('Info', 'data', 'Info Title');
			expect($log.info).to.have.not.been.calledOnce;
		});

		// Logger Error Test
		it('should call logger error when remotelevel is set to `error`', function() {
			var consoleLevels = 'error';
			var remoteLevels = 'error';
			sinon.spy($log, 'error');
			logger.init(consoleLevels, remoteLevels, REMOTE_PATH);
			logger.error('error', 'data', 'Error Title');
			expect($log.error).to.have.been.calledOnce;
		});
		it('should not call logger error method when remotelevel is not set to `error`', function() {
			var consoleLevels = 'warning,info,debug';
			var remoteLevels = 'warning,info,debug';
			sinon.spy($log, 'error');
			logger.init(consoleLevels, remoteLevels, REMOTE_PATH);
			logger.error('error', 'data', 'Error Title');
			expect($log.error).to.have.not.been.calledOnce;
		});

		// Logger Warning Test
		it('should call logger warning when remotelevel is set to `warning`', function() {
			var consoleLevels = 'warning';
			var remoteLevels = 'warning';
			sinon.spy($log, 'warn');
			logger.init(consoleLevels, remoteLevels, REMOTE_PATH);
			logger.warning('warn', 'data', 'Warning Title');
			expect($log.warn).to.have.been.calledOnce;
		});
		it('should not call logger warning when remotelevel is not set to `warning`', function() {
			var consoleLevels = 'error';
			var remoteLevels = 'error';
			sinon.spy($log, 'warn');
			logger.init(consoleLevels, remoteLevels, REMOTE_PATH);
			logger.warning('warn', 'data', 'Warning Title');
			expect($log.warn).to.have.not.been.calledOnce;
		});

		// Test Memory Saturation
		it('should not not retain many console messages', function() {
			function overLogInfo() {
				logger.info('warn', 'data', 'Warning Title');
			}
			// execute over 400 times
			_.times(401, overLogInfo);
		});
		it('should not not retain many remote messages', function() {
			function overLogRemotely() {
				logger.info('warn', 'data', 'Warning Title');
			}
			var consoleLevels = 'error,info,debug,warning';
			var remoteLevels = 'error,info,debug,warning';
			logger.init(consoleLevels, remoteLevels, REMOTE_PATH);
			// execute over 400 times
			_.times(401, overLogRemotely);
		});

	});

});
