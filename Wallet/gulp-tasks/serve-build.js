var serveCode = require('../gulp-utils/serve.js');

module.exports = serveBuild;

/**
 * serve the build environment
 * --debug-brk or --debug
 * --nosync
 */
function serveBuild() {
	return function() {
		serveCode(false /* isDev */);
	};
}
