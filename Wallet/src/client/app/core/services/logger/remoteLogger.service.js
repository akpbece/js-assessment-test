
/**
 * @module factory: remoteLogger
 */
(function() {
	'use strict';

	angular
		.module('core.logger')
		.factory('remoteLogger', remoteLogger);

	/**
	 * @function remoteLogger
	 * @param {Object} $http Uses angular $http service
	 * @description Post data to specific remote endpoint
	 */
	/* @ngInject */
	function remoteLogger($http) {

		var service = {
			post: post
		};

		return service;
		/////////////////////

		function post(path, data) {
			$http.post(path, data);
		}
	}
}());
