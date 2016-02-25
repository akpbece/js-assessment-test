var serveCode = require('../gulp-utils/serve.js');

module.exports = serve;

/**
 * serve the dev environment
 * --debug-brk or --debug
 * --nosync
 */
function serve() {
	return function() {
		serveCode(true /* isDev */);
	};
}
