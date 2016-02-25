/* jshint -W074 */

(function() {
	'use strict';

	angular
		.module('core.logger')
		.factory('logger', logger);

	/* @ngInject */
	function logger($log, remoteLogger) {

		var loggerConsoleLevels = null;
		var loggerRemoteLevels = null;
		var loggerRemotePath = null;

		var consoleMessageStack = [];
		var remoteMessageStack = [];
		var remoteMessageStackClean = false;

		var service = {
			init: init,
			error: error,
			info: info,
			debug: debug,
			warning: warning,

			// straight to console; bypass toastr
			log: $log.log
		};

		return service;
		/////////////////////

		function init(consoleLevels, remoteLevels, remotePath) {
			loggerConsoleLevels = consoleLevels.split(',');
			loggerRemoteLevels = remoteLevels.split(',');
			loggerRemotePath = remotePath;
		}

		function info(message, data, title) {
			consoleMessageStack.push(['info', message, data, title]);
			processConsoleMessages();

			addToRemoteStack('info', message, data, title);
		}

		function debug(message, data, title) {
			consoleMessageStack.push(['debug', message, data, title]);
			processConsoleMessages();

			addToRemoteStack('debug', message, data, title);
		}

		function warning(message, data, title) {
			consoleMessageStack.push(['warning', message, data, title]);
			processConsoleMessages();

			addToRemoteStack('warning', message, data, title);
		}

		function error(message, data, title) {
			consoleMessageStack.push(['error', message, data, title]);
			processConsoleMessages();

			addToRemoteStack('error', message, data, title);
		}

		function processConsoleMessages() {
			if (loggerConsoleLevels !== null) {
				for (var i = 0; i < consoleMessageStack.length; i++) {
					if (consoleMessageStack[i][0] === 'warning' &&
						loggerConsoleLevels.indexOf('warning') !== -1) {
						$log.warn('Warning: ' + consoleMessageStack[i][1],
							consoleMessageStack[i][2], consoleMessageStack[i][3]);
					} else if (consoleMessageStack[i][0] === 'info' &&
						loggerConsoleLevels.indexOf('info') !== -1) {
						$log.info('Info: ' + consoleMessageStack[i][1],
							consoleMessageStack[i][2], consoleMessageStack[i][3]);
					} else if (consoleMessageStack[i][0] === 'debug' &&
						loggerConsoleLevels.indexOf('debug') !== -1) {
						$log.debug('Debug: ' + consoleMessageStack[i][1],
							consoleMessageStack[i][2], consoleMessageStack[i][3]);
					} else if (consoleMessageStack[i][0] === 'error' &&
						loggerConsoleLevels.indexOf('error') !== -1) {
						$log.error('Error: ' + consoleMessageStack[i][1],
							consoleMessageStack[i][2], consoleMessageStack[i][3]);
					}
				}

				consoleMessageStack = [];
			} else if (consoleMessageStack.length > 400) {
				//flush to avoid memory saturation
				consoleMessageStack.splice(0, 100);
			}
		}

		function addToRemoteStack(type, message, data, title) {

			if (loggerRemoteLevels !== null) {

				if ((type === 'warning' && loggerRemoteLevels.indexOf('warning') !== -1) ||
					(type === 'info' && loggerRemoteLevels.indexOf('info') !== -1) ||
					(type === 'debug' && loggerRemoteLevels.indexOf('debug') !== -1) ||
					(type === 'error' && loggerRemoteLevels.indexOf('error') !== -1)) {
					remoteMessageStack.push([type, message, data, title]);
				}

				if (!remoteMessageStackClean) {
					var newRemoteMessageStack = [];
					for (var i = 0; i < remoteMessageStack.length; i++) {
						if ((remoteMessageStack[i][0] === 'warning' &&
							loggerRemoteLevels.indexOf('warning') !== -1) ||
							(remoteMessageStack[i][0] === 'info' &&
								loggerRemoteLevels.indexOf('info') !== -1) ||
							(remoteMessageStack[i][0] === 'debug' &&
								loggerRemoteLevels.indexOf('debug') !== -1) ||
							(remoteMessageStack[i][0] === 'error' &&
								loggerRemoteLevels.indexOf('error') !== -1)) {
							newRemoteMessageStack.push(remoteMessageStack[i]);
						}
					}

					remoteMessageStackClean = true;
					remoteMessageStack = newRemoteMessageStack;
				}

			} else {
				remoteMessageStack.push([type, message, data, title]);
			}

			if (loggerRemotePath !== null && loggerRemoteLevels !== null &&
				loggerRemoteLevels.indexOf(type) !== -1 && remoteMessageStack.length > 20) {

				var messagesToSend = remoteMessageStack.slice(0, 20);
				remoteMessageStack.splice(0, 20);

				remoteLogger.post(loggerRemotePath, messagesToSend);
			} else if (remoteMessageStack.length > 400) {
				//flush to avoid memory saturation
				remoteMessageStack.splice(0, 100);
			}
		}
	}
}());
