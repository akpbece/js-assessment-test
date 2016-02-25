/**
 * @module conductor
 * @description This script is responsible for bootstrapping the application.
 *
 * Normally, in an angular app, you manually include the `ng-app` directive
 * to an element bootstrap an app. This script will get fetch the FE assets
 * based on variant, then programmatically initialize/bootstrap.
 */
(function($) {
	'use strict';

	// Set conductor data that will be passed to the angular app
	var initialData = {
		urlParams: null,
		canary: null,
		location: {} // contents of original window location
	};

	var buildConfig = {
		serviceUrl: '{SERVICE-URL}',
		bundleUrl: '{BUNDLE-URL}'
	};

	$(document).on('ready', function() {
		// store original location data
		for (var key in document.location) {
			if (typeof document.location[key] === 'string') {
				initialData.location[key] = document.location[key];
			}
		}
		// and store a nice hash too
		initialData.location.params = getQueryParams();

		getVariant();
	});

	/**
	 * @function setAttributes
	 * @description Sets multiple attributes of an element
	 */
	function setAttributes(el, attrs) {
		for (var key in attrs) {
			if (attrs.hasOwnProperty(key)) {
				el.setAttribute(key, attrs[key]);
			}
		}
	}

	/**
	 * @function loadStyle
	 * @param variantName - variant name to be used to fetch specific variant style
	 * @description Loads CSS Asynchronously
	 */
	function loadStyle(variantName) {
		var head = document.getElementsByTagName('head')[0];
		var style = document.createElement('link');

		setAttributes(style, {
			'rel': 'stylesheet',
			'type': 'text/css',
			'href': 'styles/' + variantName + '.style.css'
		});

		head.appendChild(style);
	}

	/**
	 * @function loadScript
	 * @param variantName - variant name to be used to fetch specific variant script
	 * @description Loads JS Asynchronously
	 */
	function loadScript(variantName) {
		var loadScriptPromise = $.Deferred();
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');

		setAttributes(script, {
			'type': 'text/javascript',
			'src': 'variants/' + variantName + '.variant.js'
		});

		head.appendChild(script);

		script.onload = function() {
			loadScriptPromise.resolve();
		};

		return loadScriptPromise.promise();
	}

	/**
	 * @function loadTemplate
	 * @param variantName - variant name to be used to fetch specific
	 * variant template
	 * @description Loads Template Cache Asynchronously
	 */
	function loadTemplate(variantName) {
		var loadTemplatePromise = $.Deferred();
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');

		setAttributes(script, {
			'type': 'text/javascript',
			'src': 'templates/' + variantName + '.templates.js'
		});

		head.appendChild(script);

		script.onload = function() {
			loadTemplatePromise.resolve();
		};

		return loadTemplatePromise.promise();
	}

	/**
	 * @function getVariant
	 * @description Get the current variant from canary service then
	 * depending on what variant comes back, load the proper
	 * front end assets appropriately.
	 *
	 * Templates are depending on the script as it is dependent on app.core
	 * module. When script and the template are fully loaded, then dynamically
	 * bootstrap the angular app.
	 */
	function getVariant() {

		// set when we have live canary service in wallet:
		// var canaryUrl = '/online/walletapi/public/v6/variant/';
		// var url = buildConfig.serviceUrl + canaryUrl + locale;

		var url = 'mocks/canary/data.json';
		$.get(url)
			.then(success, fail);

		function success(response) {
			//response = JSON.parse(response);
			initialData.canary = response;
			loadStyle(response.variantId);
			loadScript(response.variantId)
				.then(function() {
					loadTemplate(response.variantId)
						.then(bootstrapApp);
				})
				.fail(fail);
		}

		function fail(e) {
			console.log('Error: Conductor - -' + e);
		}
	}

	/**
	 * @function getQueryParams
	 * @return {Object} key value pairs of url parameters
	 * @description return an object of the key/value pairs in the query string portion of the current url
	 */
	function getQueryParams() {
		var params = {};
		var query = window.location.search.substr(1).split('&');
		query.forEach(function(queryparam) {
			var pair = queryparam.split('=');
			if (pair.length === 2) {
				params[pair[0]] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
			}
		});
		return params;
	}

	/**
	/**
	 * @function bootstrapApp
	 * @description Programmatically bootstrap app
	 * and pass in values to the angular app as buildConfig and Canary Data.
	 */
	function bootstrapApp() {
		angular.element(document).ready(function() {
			angular.module('app').value('buildConfig', buildConfig);
			angular.module('app').value('initialData', initialData);

			// TODO: in production disable apiCheck
			// disabled for now until we resolve apiCheck warnings:
			// See: http://docs.angular-formly.com/v5.2.1/docs/formlyapicheck
			//
			/* jshint -W117 *//* only use of apiCheck global to disable its warnings for now */
			apiCheck.globalConfig.disabled = true;

			angular.bootstrap(document, ['app']);
		});
	}

})(jQuery);
