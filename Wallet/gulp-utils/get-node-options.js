var config = require('../gulp.config')();
var port = process.env.PORT || config.defaultPort;

module.exports = getNodeOptions;

function getNodeOptions(isDev) {
	return {
		script: config.nodeServer,
		delayTime: 1,
		env: {
			'PORT': port,
			'NODE_ENV': isDev ? 'dev' : 'build'
		},
		watch: [config.server]
	};
}
