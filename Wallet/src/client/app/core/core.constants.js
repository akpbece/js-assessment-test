(function() {
	'use strict';

	/**
	 * @constant config
	 * @description it's a constant named config :)
	 * */
	var config = {
		// TODO - tenant should be a dynamic settings parameter
		tenant: 'acmebank', // our first mtp wallet in DevCloud
		defaultLocale: 'en-us'
	};

	angular.module('app.core')
		// must use constant instead of value, so it could be injected in configuration functions
		.constant('config', config);

	// mark all the predefined properties as non configurable
	// so they could not be deleted when initializing config
	for (var i in config) {
		if (config.hasOwnProperty(i)) {
			Object.defineProperty(config, i, {configurable: false});
		}
	}

	// define the init method with defineProperty so the method is non configurable/iterable
	Object.defineProperty(config, 'init', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function(values) {
			// we are using getOwnPropertyDescriptor, safe to ignore 089 errors here
			for (var j in config) { // jshint ignore:line
				var keyDescriptor = Object.getOwnPropertyDescriptor(config, j);

				// remove any the existing config except the predefined above
				if (keyDescriptor && keyDescriptor.configurable) {
					delete config[j];
				}
			}

			// add the new values
			for (var k in values) {
				if (values.hasOwnProperty(k)) {
					config[k] = values[k];
				}
			}
		}
	});

})();
